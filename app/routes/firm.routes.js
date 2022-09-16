const { authJwt } = require("../middleware");
const controller = require("../controllers/firm.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view lawsuits */
  app.get("/api/firms/", [authJwt.verifyToken], controller.findAll);

  app.get("/api/firms/:id", [authJwt.verifyToken], controller.findOne);

  /** Moderators may create and edit lawsuits */
  app.post("/api/firms/", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.create);

  //update
  app.put("/api/firms/:id", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.update);

  /** Administrators may delete lawsuits */
  app.delete("/api/firms/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.delete);
};