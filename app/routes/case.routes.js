const { authJwt } = require("../middleware");
const controller = require("../controllers/case.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view lawsuits */
  app.get("/api/cases/", [authJwt.verifyToken], controller.findAll);
  app.get("/api/cases/events", [authJwt.verifyToken], controller.getEvents);
  app.get("/api/cases/active", [authJwt.verifyToken], controller.findAllActive);
  app.get("/api/cases/archived", [authJwt.verifyToken], controller.findAllArchived);
  app.get("/api/cases/prospective", [authJwt.verifyToken], controller.findAllProspective);
  app.get("/api/cases/:id", [authJwt.verifyToken], controller.findOne);

  /** Moderators may create and edit lawsuits */
  app.post("/api/cases/", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.create);
  app.put("/api/cases/:id", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.update);

  /** Administrators may delete lawsuits */
  app.delete("/api/cases/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.delete);
  app.delete("/api/cases/", [authJwt.verifyToken], authJwt.isAdmin, controller.deleteAll);
};