import express from "express";

import { authentication, random } from "../utils/encryption.js";
import { createUser, getUserByUsername } from "../services/users.js";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByUsername(username).select(
      "+authentication.salt +authentication.password"
    );

    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
      expires: new Date(Date.now() + 900000),
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message).end();
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { password, username, name, apartment } = req.body;

    if (!password || !username || !name || !apartment) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByUsername(username);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      username,
      name,
      apartment,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message).end();
  }
};
