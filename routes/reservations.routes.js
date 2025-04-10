const { addNewReservation, findAllReservations, findReservationById, updateReservationById, deleteReservationById } = require("../controllers/reservations.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const clientGuard = require("../middleware/guards/client.guard")

const router = require("express").Router()

router.post("/", clientGuard, addNewReservation)
router.get("/", adminGuard, findAllReservations)
router.get("/:id", adminGuard, findReservationById)
router.put("/:id", adminGuard, updateReservationById)
router.delete("/:id", adminGuard, deleteReservationById)


module.exports = router