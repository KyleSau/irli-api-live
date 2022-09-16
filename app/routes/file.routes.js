
const { authJwt } = require("../middleware");
const controller = require("../controllers/file.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /** Authenticated users may view files and download */
  app.get("/api/files/:name", /*[authJwt.verifyToken],*/ controller.download);

  //returns list of all cases
  app.get("/api/files", /*[authJwt.verifyToken],*/ controller.getListFiles);

  /** Moderators may upload */
  app.post("/api/upload", /*[authJwt.verifyToken], authJwt.isModerator,*/ controller.upload);
};