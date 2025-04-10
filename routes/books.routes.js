const { addNewBook, findAllBooks, findBookById, updateBookById, deleteBookById } = require("../controllers/books.controller");
const { getRentedBooks } = require("../filters/get.rented.book");
const ownerGuard = require("../middleware/guards/owner.guard");


const router = require("express").Router()

router.post("/", ownerGuard, addNewBook);
router.get("/", findAllBooks) 
router.get("/search/:id",  findBookById) 
router.put("/:id", ownerGuard, updateBookById)
router.delete("/:id", ownerGuard,   deleteBookById)

router.get("/rentedbook", getRentedBooks)

module.exports = router