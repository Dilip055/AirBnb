
import mongoose, { Schema } from "mongoose";
import Review from "./review.js";
const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  location: String,
  country: String,
   latitude: Number,
  longitude: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
});

listingSchema.post('findOneAndDelete', async function (data) {
  
  if (data) {
    await Review.deleteMany({ _id: { $in: data.reviews } });
  }
});

export default mongoose.model("Listing", listingSchema);
