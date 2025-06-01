import passport from "passport";
import User from "../models/user.js";
import wrapAsync from "../utils/wrapAsync.js";

export const renderRegisterForm = (req, res) => {
  res.render("Users/signup");
};

export const renderLoginForm = (req, res) => {
  res.render("Users/login");
};

export const registerUser = async (req, res) => {
  const {username, email, password } = req.body;
  const profileImage = req.file.path;
  console.log(profileImage);
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.redirect("/users/register?error=User already exists.");
  }
  const newUser = new User({ email, username, profileImage:profileImage });
  const registeredUser = await User.register(newUser, password);
  req.login(registeredUser, (err) => {
    if (err) {
      return res.redirect("/users/register?error=User registration failed.");
    }
    res.redirect("/listings?success=User created successfully!");
  });
};

export const loginUser = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        return res.redirect('/users/login?error=Invalid username or password.');
      }
  
      req.login(user, (err) => {
        if (err) {
          return res.redirect('/users/login?error=Login failed.');
        }
  
        // Use saved redirect URL or default
        const redirectUrl = res.locals.redirectUrl || '/listings';
  
        // Optional: clean up session
        delete req.session.redirect;
        // Redirect with success message
        res.redirect(`${redirectUrl}?success=Logged in successfully!`);
      });
    })(req, res, next);
  };
  
  
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
     return next(err);
    }})
  res.redirect("/users/login?success=Logged out successfully!");
}

  
export const profileUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render("Users/profile", { user });
}

