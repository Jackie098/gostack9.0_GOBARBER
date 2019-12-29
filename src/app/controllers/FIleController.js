import File from '../models/File';

class FileController {
  async store(req, res) {
    /**
     * Utilizando desestruturação, pegamos o 'originalname' e 'filename'
     * do arquivo que está sendo passada na requisição e nomeamos ele como,
     * respectivamente: 'name' e 'path', que condiz com o 'nome original do
     * arquivo' e 'o novo nome que nós demos'
     */
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
