import express from "express";
import mongoose from "mongoose";
import path from "path";
import url from "url";
import methodOverride from "method-override";
import ejsmate from "ejs-mate";
import session from "express-session";
import MongoStore from "connect-mongo";
// import  { sampleListings }  from "./app.js";
import listingRoute from "./routes/listing.js";
import reviewRoute from "./routes/review.js";
import passport from "passport";
import localStrategy from "passport-local";
// import userRoutes from "./routes/user.js";
import dotenv from "dotenv";
import User from "./models/user.js";
// import listing from "./models/listing.js";
import userRoute from "./routes/user.js";
import { sampleListings } from "./app.js";
import listingData from "./models/listing.js";
import listing from "./models/listing.js";
if(process.env.NODE_ENV != "production"){
  dotenv.config();
}


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Template engine setup
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = new MongoStore({
  mongoUrl: process.env.MONGO_URI,
  crypto: {
    key: process.env.SESSION_SECRET,
  },
  touchAfter:24 * 3600
});

store.on("error", console.error);


const sessionOption = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  }
};
app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});


// Static files
app.use(express.static(path.join(__dirname, "public")));

// Method override for PUT and DELETE methods
app.use(methodOverride("_method"));


// const addListing = async () => {
//   try {
//     await listing.deleteMany();

//     const updatedListings = sampleListings.map(listing => ({
//       ...listing,
//       owner: "6836c04b22a452e4fb601f0f",
//     }));

//     const addedListings = await listing.insertMany(updatedListings);

//     console.log('Inserted listings:', addedListings);
//   } catch (error) {
//     console.error('Error inserting listings:', error);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// addListing();

app.get('/',(req,res)=>{
  res.redirect('/listings')
})
//routes
app.use("/listings", listingRoute)
app.use("/reviews", reviewRoute)
app.use("/users", userRoute)
// Connect to MongoDB with error handling
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
}
connectDB();




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


