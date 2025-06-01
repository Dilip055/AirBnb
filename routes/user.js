import express from "express";
import { loginUser, logoutUser, profileUser, registerUser, renderLoginForm, renderRegisterForm } from "../controllers/user.controller.js";
import wrapAsync from "../utils/wrapAsync.js";
import { savedUrl } from "../middleware/isloggedIn.js";
import { storage } from "../utils/cloudinary.js";
import multer from "multer"

const upload = multer({ storage });


const router = express.Router();

router.get("/register", renderRegisterForm);
router.get("/login", renderLoginForm);
router.post("/register",upload.single('profileImage'),wrapAsync(registerUser));
router.post("/login",savedUrl,loginUser);
router.get("/logout",logoutUser);
router.get("/profile",savedUrl,wrapAsync(profileUser));
export default router;