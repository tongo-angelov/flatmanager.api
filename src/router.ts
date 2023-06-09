import express from "express";

import authentication from "./modules/auth/authRouter.js";
import users from "./modules/users/userRouter.js";
import posts from "./modules/posts/postRouter.js";
import comments from "./modules/comments/commentRouter.js";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  posts(router);
  comments(router);

  return router;
};
