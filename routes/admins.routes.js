const { findAllAdmins, findAdminById, updateAdminById, deleteAdminById, loginAdmin, logoutAdmin, refreshTokenAdmin, signUpAdmin, updatePassword, updatePasswordAdmin } = require("../controllers/admins.controller")
const adminGuard = require("../middleware/guards/admin.guard")
const adminSelfGuard = require("../middleware/guards/admin.self.guard")
const isSuperAdminGuard = require("../middleware/guards/is.super.admin.guard")

const router = require("express").Router()

router.post("/", adminGuard, isSuperAdminGuard, signUpAdmin)
router.get("/", adminGuard, isSuperAdminGuard, findAllAdmins)
router.get("/:id", adminGuard, adminSelfGuard,   findAdminById)
router.put("/password", adminGuard,  adminSelfGuard, updatePasswordAdmin)
router.put("/:id", adminGuard,  isSuperAdminGuard, updateAdminById)
router.delete("/:id",adminGuard, isSuperAdminGuard, deleteAdminById)

router.post("/login", loginAdmin)
router.post("/logout", logoutAdmin)
router.post("/refresh", refreshTokenAdmin)



module.exports = router