const { authJwt } = require("../middleware");
const controller = require("../controllers/contact.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view lawsuits */
  app.get("/api/contacts/", [authJwt.verifyToken], controller.findAll);

  app.get("/api/contacts/:id", [authJwt.verifyToken], controller.findOne);

  /** Moderators may create and edit lawsuits */
  app.post("/api/contacts/", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.create);

  //update
  app.put("/api/contacts/:id", [authJwt.verifyToken], authJwt.isModeratorOrAdmin, controller.update);

  /** Administrators may delete lawsuits */
  app.delete("/api/contacts/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.delete);
};