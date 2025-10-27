// This controller can be used to get the profile of the currently authenticated user.
const getCurrentUser = (req, res) => {
    // The user and delegatedUser objects were attached by the authMiddleware
    const { user, delegatedUser } = req;
  
    if (!user) {
      // This case should theoretically not be hit if the middleware is active
      return res.status(401).json({ message: 'No user data found in token.' });
    }
  
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: user,
      delegatedTo: delegatedUser || null // Return null if not delegated
    });
  };
  
  module.exports = {
    getCurrentUser,
  };