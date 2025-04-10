const { addNewPayment, findAllPayments, findPaymentById, updatePaymentById, deletePaymentById } = require("../controllers/payments.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const clientGuard = require("../middleware/guards/client.guard")

const router = require("express").Router()

router.post("/", clientGuard, addNewPayment)
router.get("/", adminGuard, findAllPayments)
router.get("/:id", clientGuard, findPaymentById)
router.put("/:id", adminGuard, updatePaymentById)
router.delete("/:id", adminGuard, deletePaymentById)


module.exports = router