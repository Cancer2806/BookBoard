// helper function to be used as middleware to prevent access to certain functions unless logged in
const withAuth = (req, res, next) => {
  // If the user is not logged in, redirect the request to the login route
  if (!req.session.logged_in) {
    res.redirect('/login');
  } else {
    // If the user is logged in, proceed to the requested endpoint
    next();
  }
};

module.exports = withAuth;
