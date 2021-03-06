import Sequelize, { Model } from 'sequelize';

import { isBefore, subHours } from 'date-fns';

class Appointment extends Model {
  static init(sequelize) {
    /**
     * Os campos de chave estrangeira não são criados no 'init' porque
     * são iniciados com o método 'associate' mais abaixo
     */
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(), subHours(this.date, 2));
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  /**
   * Quando há mais de uma associação, deve-se obrigatoriamente fornecer um
   * apelido para estas "contraints"
   */
  static associate(models) {
    this.belongsTo(models.User, { foreingKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreingKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;
