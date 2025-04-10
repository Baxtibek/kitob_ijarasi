const { addNewContract, findAllContracts, findContractById, updateContractById, deleteContractById } = require("../controllers/contracts.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const adminSelfGuard = require("../middleware/guards/admin.self.guard")
const clientGuard = require("../middleware/guards/client.guard")
const clientSelfGuard = require("../middleware/guards/client.self.guard")

const router = require("express").Router()

router.post("/", clientGuard, addNewContract)
router.get("/", adminGuard, adminSelfGuard,  findAllContracts)
router.get("/:id", adminGuard, adminSelfGuard, findContractById)
router.get("/client/:id", clientGuard, clientSelfGuard, findContractById)
router.put("/:id", adminGuard, adminSelfGuard, updateContractById)
router.put("/client/:id", clientGuard,  updateContractById)
router.delete("/:id", adminGuard, adminSelfGuard, deleteContractById)


module.exports = router