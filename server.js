const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./auth_config.json");

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}`,
});

const express = require("express");
const { join } = require("path");
const app = express();
// Serve static assets from the /public folder (e.g.: *.js, *.css)
app.use(express.static(join(__dirname, "public")));
// Endpoint to serve the auth configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});
// checkJwt is executed before the current handler
app.get("/api/external", checkJwt, (req, res) => {
  res.send({ msg: "Your access token was successfully validated!" });
});

// error handler so that a JSON response is returned from your API in the event of a missing or invalid token
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).send({ msg: "Invalid token" });
  }
  next(err, req, res);
});

// Serve the index page for all other requests
app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});


// Listen on port 3000
app.listen(3000, () => console.log("Application running on port 3000"));