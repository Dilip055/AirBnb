export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    
    return next();
  }
  req.session.redirect = req.originalUrl;
  res.redirect("/users/login?error=You must be logged in to access this page.");
};


export const savedUrl = (req, res, next) => {
  if (req.session.redirect) {
    res.locals.redirectUrl = req.session.redirect;
  }
  next();
};