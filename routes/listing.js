import express from "express";
import * as listingsController from "../controllers/listing.controller.js";
import {isLoggedIn} from "../middleware/isloggedIn.js";
import { isOwner } from "../middleware/isOwner.js";
import { storage } from "../utils/cloudinary.js";
import multer from "multer"
const router = express.Router();

const upload = multer({ storage });
router.get("/", listingsController.index); // list all
router.get("/new",isLoggedIn,listingsController.renderNewForm); // form to create new listing
router.post("/new",isLoggedIn,upload.single('image'),  listingsController.createListing); // create new listing

router.get("/:id", listingsController.showListing); // show one listing
router.get("/:id/edit",isLoggedIn, listingsController.renderEditForm); // edit form
router.put("/:id/edit",isLoggedIn,isOwner,upload.single('image'), listingsController.updateListing); // update listing
router.delete("/:id",isLoggedIn, isOwner, listingsController.deleteListing); // delete listing

export default router;
