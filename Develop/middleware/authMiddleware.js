const authMiddleware = (req, res, next) => {
    // Check if user is logged in (session has user_id)
    if (req.session && req.session.user_id) {
      next();
    } else {
      // Store the requested path in session to redirect back to it after login
      req.session.redirectTo = req.originalUrl;
      res.redirect('/login');
    }
  };
  
  module.exports = authMiddleware;
  