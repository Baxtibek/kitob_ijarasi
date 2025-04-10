const { addNewContract, findAllContracts, findContractById, updateContractById, deleteContractById } = require("../controllers/contracts.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const clientGuard = require("../middleware/guards/client.guard")
const isSuperAdminGuard = require("../middleware/guards/is.super.admin.guard")

const router = require("express").Router()

router.post("/", clientGuard, addNewContract)
router.get("/", adminGuard, isSuperAdminGuard,  findAllContracts)
router.get("/:id", adminGuard, isSuperAdminGuard, findContractById)
router.get("/client/:id", clientGuard, findContractById)
router.put("/:id", adminGuard, isSuperAdminGuard, updateContractById)
router.put("/client/:id", clientGuard,   updateContractById)
router.delete("/:id", adminGuard, isSuperAdminGuard, deleteContractById)


module.exports = router