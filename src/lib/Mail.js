import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;

    this.trasporter = nodemailer.createTransport({
      host,
      port,
      secure,

      /**
       * Verifica se no 'auth' existe um usuário. Pois em algumas
       * estratégias de envio de e-mail, ele não possui autenticação.
       * Caso haja um usuário e senha, ele é passado como objeto, caso não
       * haja, ele passa nulo e apenas são utilizados os valores acima
       */
      auth: auth.user ? auth : null,
    });
  }

  /**
   * Envia tudo do remetente (tudo que está em default) e tudo
   * que está sendo passado como parâmetro
   */
  sendMail(message) {
    return this.trasporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail();
