const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify the token
    // IMPORTANT: You MUST have the same JWT_SECRET that the company's API uses to sign the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user and delegation info to the request object
    req.user = decoded.user; // Primary user
    
    // Delegated User (if delegated)
    if (decoded.delegatedTo) {
      req.delegatedUser = decoded.delegatedTo;
    }

    // 4. Pass control to the next handler (your controller)
    next();
  } catch (error) {
    // If the token is invalid (e.g., expired, bad signature)
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;