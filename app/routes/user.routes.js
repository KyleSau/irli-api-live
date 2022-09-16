const { authJwt } = require("../middleware");
const { verifySignUp } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // create new user
  app.post("/api/users", [
    verifySignUp.checkDuplicateUsernameOrEmail
  ], authJwt.verifyToken, authJwt.isAdmin, controller.create);
  // read all users
  app.get("/api/users", [authJwt.verifyToken], authJwt.isAdmin, controller.getAll);
  // read user by id
  app.get("/api/users/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.getById);
  // update user by id
  app.put("/api/users/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.update);
  // delete user by id
  app.delete("/api/users/:id", [authJwt.verifyToken], authJwt.isAdmin, controller.delete);
};