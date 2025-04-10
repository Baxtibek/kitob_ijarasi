const { signUpClient, findAllClients, findClientById, updateClientById, deleteClientById, loginClient, logoutClient, refreshTo, signUpClientkenClient, refreshTokenClient, activateClient, updatePasswordClient } = require("../controllers/clients.controller")
const { getCancelledClients } = require("../filters/cancelled.clients")
const { getClientPayments } = require("../filters/client.payments")
const { getDamagedClients } = require("../filters/damaged.client")
const adminGuard = require("../middleware/guards/admin.guard")
const clientGuard = require("../middleware/guards/client.guard")
const clientSelfGuard = require("../middleware/guards/client.self.guard")

const router = require("express").Router()

router.get("/cancelled", getCancelledClients)
router.get("/damaged", getDamagedClients)
router.get("/clientpay", getClientPayments)


router.post("/", signUpClient)
router.get("/", adminGuard,   findAllClients)
router.put("/password", clientGuard, updatePasswordClient)
router.get("/:id", clientGuard,  findClientById)
router.put("/:id", clientGuard, clientSelfGuard, updateClientById)
router.delete("/:id", clientGuard,clientSelfGuard, deleteClientById)

router.post("/login", loginClient)
router.post("/logout", logoutClient)
router.post("/refresh", refreshTokenClient)
router.get("/activate/:link", activateClient)



module.exports = router
