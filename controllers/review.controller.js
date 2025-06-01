import Listing from "../models/listing.js";
import Review from "../models/review.js";
import ExpressError from "../utils/ExpressError.js";
export const addReview = async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const listing = await Listing.findById(id);
    if (!listing) {
      return new ExpressError("Listing not found", 404);
    }

    const newReview = new Review({
      comment,
      rating,
      author: req.user._id,
    });

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${id}?success=Review added successfully!`);
};






  export const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
  
   
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}?success=Review deleted successfully!`);

  };
  