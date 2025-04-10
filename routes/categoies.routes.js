const { addNewCategory, findAllCategories, findCategoryById, updateCategoryById, deleteCategoryById } = require("../controllers/categoies.controller")
const { getTopAuthorsByCategory } = require("../filters/top.up.author.by.category")
const adminGuard = require("../middleware/guards/admin.guard")
const isSuperAdminGuard = require("../middleware/guards/is.super.admin.guard")
const { route } = require("./books.routes")

const router = require("express").Router()

router.get("/topupauthor", getTopAuthorsByCategory)

router.post("/", adminGuard, isSuperAdminGuard, addNewCategory)
router.get("/", findAllCategories)
router.get("/:id", findCategoryById)
router.put("/:id", adminGuard, isSuperAdminGuard, updateCategoryById)
router.delete("/:id", adminGuard, isSuperAdminGuard, deleteCategoryById)


module.exports = router