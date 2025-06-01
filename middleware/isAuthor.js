import Review from "../models/review.js";
export const isAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    console.log(review.author);
    if (!review) {
      return res.redirect(`/listings/${req.params.id}?error=Review not found.`);
    }
  
    if (!review.author.equals(res.locals.currentUser._id)) {
      return res.redirect(`/listings/${req.params.id}?error=You are not the author of this review.`);
    }
  
    next();
  };