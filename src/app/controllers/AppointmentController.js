/* eslint-disable camelcase */
import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    /**
     * Paginação da consulta. Página 01, exibe os 20 primeiros
     * registros (limit:20).
     * offset -> Pág 01, não pula nenhum, mas pág 02 pula os 20 primeiros
     * registros
     */
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json({ appointments });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      providerId: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails' });
    }

    const { providerId, date } = req.body;

    /**
     * Check if providerId is a provider
     */
    const isProvider = await User.findOne({
      where: { id: providerId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * - parseIso -> Converte a string de hora da requisição para o
     *  formato 'DATE' do javascript
     * - startOfHour -> Captura apenas a hora da data,ignorando o resto, ou
     * seja, será possível apenas fazer agendamentos de hora em hora
     */
    const hourStart = startOfHour(parseISO(date));

    /**
     * Verifica se a data já passou, se sim, envia um erro como resposta
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    /**
     * Verifica se já não existe alguém com aquele horário reservado
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        providerId,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    /**
     * Para o usuário que está fazendo o agendamento, seu ID está no middleware
     * de autenticação, por isso pode ser facilmente passado através da
     * requisição
     */
    const appointment = await Appointment.create({
      userId: req.userId,
      providerId,
      date: hourStart,
    });

    /**
     * Notificar o prestador de serviços
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às 'H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: providerId,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
