const { addNewStatus, findAllStatus, findStatusById, updateStatusById, deleteStatusById } = require("../controllers/status.controller")
const adminGuard = require("../middleware/guards/admin.guard")

const router = require("express").Router()

router.post("/", adminGuard, addNewStatus)
router.get("/",adminGuard, findAllStatus)
router.get("/:id", adminGuard, findStatusById)
router.put("/:id", adminGuard, updateStatusById)
router.delete("/:id",adminGuard, deleteStatusById)


module.exports = router