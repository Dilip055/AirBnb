import express from "express";
import { addReview, deleteReview } from "../controllers/review.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import validate from "../middleware/validate.js";
import { reviewSchema } from "../validate/reviewValidate.js";
import { isLoggedIn } from "../middleware/isloggedIn.js";
import { isAuthor } from "../middleware/isAuthor.js";

const router = express.Router();

router.post("/listings/:id/reviews",isLoggedIn, validate(reviewSchema), wrapAsync(addReview));
router.delete("/listings/:id/reviews/:reviewId",isLoggedIn,isAuthor, wrapAsync(deleteReview));


export default router;