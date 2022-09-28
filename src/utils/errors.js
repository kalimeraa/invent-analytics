export const Errors = {
  User : {
    USER_ALREADY_EXISTS: {
      code: "USER_ALREADY_EXISTS",
      message: "User already exists",
    },
    USER_NONEXISTENT: {
      code: "User NONEXISTENT",
      message: "Not found",
    },
  },
  Book : {
    BOOK_NONEXISTENT: {
      code: "Book NONEXISTENT",
      message: "Not found",
    },

    BOOK_ALREADY_EXISTS: {
      code: "BOOK_ALREADY_EXISTS",
      message: "Book already exists",
    },

    BOOK_ALREADY_BORROWED: {
      code: "BOOK",
      message: "Book already borrowed",
    },

    BOOK_ALREADY_RETURNED: {
      code: "BOOK",
      message: "Book already returned",
    },

    BOOK_HAS_NOT_BORROWED: {
      code: "BOOK",
      message: "Book has not borrowed",
    },
  }, 

  NONEXISTENT: {
    code: "NONEXISTENT",
    message: "Not found",
  },

  VALIDATION_FAILS: {
    code: "VALIDATION_FAILS",
    message: "Validation fails",
  },
  SERVER_ERROR: {
    code: "SERVER_ERROR",
    message: "Internal server error",
  },
};
