import * as Yup from "yup";
import User from "../models/User";
import Book from "../models/Book";
import { Errors } from "../utils/errors";

let userController = {
  store: async (req, res) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: Errors.VALIDATION_FAILS });

      const { name } = req.body;
      const userExists = await User.findOne({ where: { name } });

      if (userExists)
        return res.status(400).json({ error: Errors.User.USER_ALREADY_EXISTS });

      const user = await User.create(req.body);

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  index: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name'],
      });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  show: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      
      if (!user)
        return res.status(404).send({ error: Errors.User.USER_NONEXISTENT });
      
      var borrows = await user.getBorrows({
        group:['bookId','isReturned']
      })

      const pastBorrows = borrows.filter(borrow => borrow.isReturned === true);
      const presentBorrows = borrows.filter(borrow => borrow.isReturned === false);

      const presentBooks = await Promise.all(presentBorrows.map(async borrow => {
        var book = await borrow.getBook();
        var score = await book.score();
        return {
            name: book.name,
            score: score
        };
      }));

      const pastBooks = await Promise.all(pastBorrows.map(async borrow => {
        var book = await borrow.getBook();
        var score = await book.score();
        return {
            name: book.name,
            score: score
        };
      }));

      return res.status(200).json({
          id: user.id,
          name: user.name,
          books: {
            past: pastBooks,
            present: presentBooks
          }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  borrowBook: async (req, res) => {
    try {
      const { userId,bookId } = req.params;
      const user = await User.findByPk(userId);
      const book = await Book.findByPk(bookId);

      if (!user) {
        return res.status(404).send({ error: Errors.User.USER_NONEXISTENT });
      }
      
      if (!book) {
        return res.status(404).send({ error: Errors.Book.BOOK_NONEXISTENT });
      }
      
      if(!await book.isAvailableToBorrow()) {
        return res.status(400).json({ error: Errors.Book.BOOK_ALREADY_BORROWED });
      }

      const borrow = await book.createBorrow({userId,bookId,isReturned: false});

      return res.status(200).json(borrow);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },

  returnBook: async (req, res) => {
    try {
      const { userId,bookId } = req.params;
      const user = await User.findByPk(userId);
      const book = await Book.findByPk(bookId);
      if (!user) {
        return res.status(404).send({ error: Errors.User.USER_NONEXISTENT });
      }
      
      if (!book) {
        return res.status(404).send({ error: Errors.Book.BOOK_NONEXISTENT });
      }

      var { score } = req.body;

      const schema = Yup.object().shape({
        score: Yup.number().required().positive().min(1).max(10),
      });

      score = parseFloat(score).toFixed(1);

      if (!(await schema.isValid(req.body)))
        return res.status(400).json({ error: Errors.VALIDATION_FAILS });
      
      const borrow = await book.canItBeReturned(userId);

      if(borrow.length === 1) {
        await borrow[0].update({isReturned: true});
        await book.createScore({ userId, score});

        return res.status(200).json(borrow[0]);
      }
      
      return res.status(400).json({ error: Errors.Book.BOOK_HAS_NOT_BORROWED });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: Errors.SERVER_ERROR });
    }
  },
};

export default userController;
