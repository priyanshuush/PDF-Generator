const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];

    if (token) {
        const decodedToken = jwt.verify(token, "RANDOM-TOKEN");
        const user = decodedToken;
        request.user = user; // Attach user details to the request if logged in
    }

    // pass down functionality to the endpoint
    next();

  } catch (error) {
    response.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};