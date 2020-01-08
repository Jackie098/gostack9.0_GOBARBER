import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

/**
 * Cara background Job terá sua próprima fila.
 * Uma fila para -> Envio de cancelamentos de agendamento por e-mail
 * Uma fila para -> Envio de confirmação de agendamento por e-mail
 * etc...
 */
class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  /**
   *    - Pegamos todos os jobs e armazenamos na variável
   * 'queus' (através do forEach)
   *    - Dentro do 'queues' vai ser passado a conexão com redis, a chave
   * do respectivo valor e o método handle (o método responsável por processar
   * o job. Ele recebe as informações e vai fazer determinada ação dependendo
   * de como foi condado, no caso, enviar e-mails)
   *
   * OBS - Com a desestruturação logo na variável que receberia
   * cada job (da fila de jobs) no 'forEach', a gente pôde simplificar
   * este trabalho com 'key' e 'handle'
   *
   * Método responsável por armazenas os objetos na fila 'queues'
   * Inicializando a fila
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Método responsável por adicionar novos jobs na fila
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Processa as jobs das filas
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}:FAILED`, err);
  }
}

export default new Queue();
