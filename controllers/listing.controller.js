
import Listing from "../models/listing.js"; 
import ExpressError from "../utils/ExpressError.js";
import wrapAsync from "../utils/wrapAsync.js";
import NodeGeocoder from 'node-geocoder';

const options = {
  provider: 'openstreetmap',
};

const geocoder = NodeGeocoder(options);



// Show all listings
export const index = wrapAsync(async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
});

// Render form to create a new listing
export const renderNewForm = (req, res) => {
  res.render("listings/new");
}


export const createListing = wrapAsync(async (req, res) => {
  const { title, description, price, location, country } = req.body;
  const image = req.file.path;
  const fullAddress = `${location}, ${country}`;

  // Check for existing listing
  const existingListing = await Listing.findOne({ title });
  if (existingListing) {
    return res.redirect("/?error=Listing already exists.");
  }

  // 🗺️ Get coordinates using OpenStreetMap
  const geoData = await geocoder.geocode(fullAddress);

  if (!geoData.length) {
    return res.redirect("/?error=Invalid location.");
  }

  const latitude = geoData[0].latitude;
  const longitude = geoData[0].longitude;

  // Create listing with coordinates
  const newListing = new Listing({
    title,
    description,
    image,
    price,
    location,
    country,
    owner: req.user._id,
    latitude,
    longitude,
  });

  await newListing.save();
  res.redirect("/listings?success=Listing created successfully!");
});

// Render edit form for a listing
export const renderEditForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    return res.redirect("/?error=Listing not found.");
  }
  res.render("listings/edit", { listing });
});

export const updateListing = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  if (req.file) {
    // If using multer-storage-cloudinary, req.file.path or req.file.url usually contains Cloudinary URL.
    // Adjust based on your setup.

    // For example:
    updateData.image = req.file.path || req.file.url;

    // If you want to remove old image from Cloudinary, you can do that here (optional)
    // But you need to store public_id of old image in your DB for that.
  }

  await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res.redirect(`/listings/${id}?success=Listing updated successfully!`);
});

export const showListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate("owner")
    .populate({ path: "reviews", populate: { path: "author" } });

  if (!listing) throw new ExpressError("Listing not found", 404);
  
  res.render("listings/show", { listing });
};



// Delete a listing
export const deleteListing = wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect("/listings?success=Listing deleted successfully.");
});
