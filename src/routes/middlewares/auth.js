const auth = (req, res, next) => {
  // 1. Get token from req.headers

  // const {token} = req.headers
  const token = req.headers["authorization"];

  // 2. If token or header doesnt exist, return 401 => unauth
  if (!token) {
    res.status(401).send("Token doesn't exist.");
    return;
  }
  // 3. Parse JWT Token to user

  // if failed: token invalid => return 401
  req.user = {};
  next();
};
