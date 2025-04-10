const { addNewBook, findAllBooks, findBookById, updateBookById, deleteBookById } = require("../controllers/books.controller");
const ownerGuard = require("../middleware/guards/owner.guard");
const ownerSelfGuard = require("../middleware/guards/owner.self.guard");


const router = require("express").Router()

router.post("/", ownerGuard, addNewBook);
router.get("/", findAllBooks) 
router.get("/search/:id",  findBookById) 
router.put("/:id", ownerGuard, updateBookById)
router.delete("/:id", ownerGuard,   deleteBookById)


module.exports = router