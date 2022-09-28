import * as Yup from "yup";
import Book from "../models/Book";
import { Errors } from "../utils/errors";

let bookController = {
  store: async (req, res) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: Errors.VALIDATION_FAILS });

      const { name } = req.body;
      const bookExists = await Book.findOne({ where: { name } });

      if (bookExists)
        return res.status(400).json({ error: Errors.Book.BOOK_ALREADY_EXISTS });

      const book = await Book.create(req.body);

      return res.status(200).json(book);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  index: async (req, res) => {
    try {
      const books = await Book.findAll(
        {
          attributes: ['id', 'name'],
        }
      );  

      return res.status(200).json(books);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);

      if (!book)
        return res.status(404).send({ error: Errors.Book.BOOK_NONEXISTENT });

      return res.status(200).json({
        id: book.id,
        name: book.name,
        score: await book.score()
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },
};

export default bookController;
