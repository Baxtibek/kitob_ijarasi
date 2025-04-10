// console.log("owner.route.js")
const { signUpOwner, findAllOwners, findOwnerById, updateOwnerById, deleteOwnerById, loginOwner, logoutOwner,   refreshTokenOwner, activateOwner, updatePasswordOwner } = require("../controllers/owner.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const adminSelfGuard = require("../middleware/guards/admin.self.guard")
const ownerGuard = require("../middleware/guards/owner.guard")
const ownerSelfGuard = require("../middleware/guards/owner.self.guard")

const router = require("express").Router()

router.post("/", signUpOwner)
router.get("/", ownerGuard, findAllOwners)
router.get("/:id", ownerGuard,  findOwnerById)
router.put("/:id", ownerGuard, ownerSelfGuard, updateOwnerById)
router.put("/password", ownerGuard, ownerSelfGuard, updatePasswordOwner)
router.delete("/:id", adminGuard, adminSelfGuard, deleteOwnerById)

router.post("/login", loginOwner)
router.post("/logout", logoutOwner)
router.post("/refresh", refreshTokenOwner)
router.get("/activate/:link", activateOwner)


module.exports = router