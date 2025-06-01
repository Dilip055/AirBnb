import Listing from "../models/listing.js";

export const isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  
  if (!listing) {
    return res.redirect("/listings?error=Listing not found.");
  }

  // Proper ObjectId comparison
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    return res.redirect(`/listings/${req.params.id}?error=You are not the owner of this listing.`);
  }

  next();
};