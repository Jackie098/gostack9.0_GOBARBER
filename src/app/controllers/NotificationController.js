import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    /**
     * Mongoose é diferente do Sequelize. Para exibir todos, usamos o 'find'
     * - Sort -> Para ordenar
     */
    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    /**
     * Busca e atualiza.
     * O 1º param -> É o valor de busca.
     * O 2º param -> É o que eu quero atualizar no registro da
     * respectiva coleção.
     * O 3º param -> Retorna o registro atualizado
     */
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
