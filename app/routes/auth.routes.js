const { verifySignUp } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     description: Create an user
   *     parameters:
   *     - in : body
   *       name: user
   *       schema:
   *          type : object
   *          required:
   *            - username
   *            - password
   *            - email
   *            - role
   *          properties:
   *              username :
   *                  type: string
   *              email :
   *                   type : string
   *                   example : any@host.com
   *              password :
   *                   type : string
   *              roles :
   *                  type : array
   *                  item :
   *                        type : String
   *                  example : ["moderator","user"]
   *     responses:
   *       201:
   *         description: Created
   *
   */
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     description: user login
   *     parameters:
   *     - in : body
   *       name: user
   *       schema:
   *          type : object
   *          required:
   *            - username
   *            - password
   *            - email
   *            - role
   *          properties:
   *              username :
   *                  type: string
   *              password :
   *                   type : string
   *     responses:
   *       201:
   *         description: Created
   *
   */
  app.post("/api/auth/signin", controller.signin);
};
