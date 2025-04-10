const { addNewReview, findAllReviews, findReviewById, updateReviewById, deleteReviewById } = require("../controllers/reviews.controller")

const router = require("express").Router()

router.post("/", addNewReview)
router.get("/", findAllReviews)
router.get("/:id", findReviewById)
router.put("/:id", updateReviewById)
router.delete("/:id", deleteReviewById)


module.exports = router