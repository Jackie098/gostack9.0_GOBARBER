import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    dastination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

    /**  Adicionar um código único para cada imagem
     * inserida pelo usuário (para por no perfil, vulgo upload).
     * A necessidade disso se dá para que imagens não tenham o mesmo nome do
     * arquivo que o usuário fez upload para evitar sobreposição de imagem ou
     * imagens com nomes muito estranhos
     * */
    filename: (req, file, callback) => {
      /**
       * Cryto é uma biblioteca nativa do JS e serve também para gerar números
       * ramdomicos. O primeiro argumento remete-se para a quantidade de bytes,
       * e o segundo, é a função de retorno, o modelo antigo do async/await
       */
      crypto.randomBytes(16, (err, res) => {
        if (err) return callback(err);

        /**
         * Se deu tudo certo, retorna o 'callback'(os bytes gerados)
         * transformados em hexadecimais CONCATENADO a extensão da imagem
         * que o usuário fez upload
         */
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
