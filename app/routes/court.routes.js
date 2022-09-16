const { authJwt } = require("../middleware");
const controller = require("../controllers/court.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view lawsuits */
  app.get("/api/courts/", [authJwt.verifyToken], controller.findAll);
  app.get("/api/courts/:id", [authJwt.verifyToken], controller.findOne);
};