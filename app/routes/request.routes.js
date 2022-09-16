const { authJwt } = require("../middleware");
const controller = require("../controllers/request.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view requests */
  app.get("/api/requests/", [authJwt.verifyToken], controller.findAll);
  app.get("/api/requests/active", [authJwt.verifyToken], controller.findAllActive);
  app.get("/api/requests/archived", [authJwt.verifyToken], controller.findAllArchived);
  app.get("/api/requests/litigation", [authJwt.verifyToken], controller.findAllLitigation);
  app.get("/api/requests/:id", [authJwt.verifyToken], controller.findOne);

  /** Moderators may create and edit requests */
  app.post("/api/requests/", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.create);
  app.put("/api/requests/:id", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.update);

  /** Administrators may delete requests */
  app.delete("/api/requests/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.delete);
  app.delete("/api/requests/", [authJwt.verifyToken], authJwt.isAdmin, controller.deleteAll);
};