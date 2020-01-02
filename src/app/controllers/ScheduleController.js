import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Appointment from '../models/Appointment';
import User from '../models/User';

/**
 * Controle de Agenda - Por uma perspectiva do prestador de serviço.
 * Equivale ao 'ProviderController', pois compartilha do mesmo 'model'
 * de outro controller (no caso, AppointmentController)
 */
class ScheduleController {
  async index(req, res) {
    const checkUserProvider = User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    /**
     * Serão mostrados todos os agendamentos de um determinado dia, entre
     * seu início (00:00) e seu fim (23:59) com o parâmetro de
     * pesquisa 'between'. Nisso, eu passo dois valores: a hora inicial
     * e a hora final do mesmo dia
     */
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
