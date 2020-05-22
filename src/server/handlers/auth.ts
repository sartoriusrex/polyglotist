/// <reference path="../global.d.ts"/>

require('dotenv').config({ path: `${__dirname}/.env` });

import { Request, Response } from 'express';

const { validationResult } = require('express-validator');
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database';
import cookie from '../utils/constants';

const salt = 10;
const secret: any = process.env.SECRET_KEY;

export default {
  addUser: async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, salt);
    const errorsResult = validationResult(req);

    // Simple server-side validation of inputs
    if (errorsResult.errors.length > 0) {
      return res.status(422).send({
        message:
          'Please correct either your email, username, or password to match the rules below.',
      });
    }

    // Check that username and email are not already in use
    try {
      const usernameQuery = await db.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      const emailQuery = await db.query(
        'SELECT email FROM users WHERE email = $1',
        [email]
      );

      if (usernameQuery.rows[0])
        return res.status(401).send({ message: 'User already exists.' });

      if (emailQuery.rows[0])
        return res.status(401).send({ message: 'Email already in use.' });
    } catch (err) {
      console.log('No user found. we can continue creating user.');
    }

    // Create new user and return it
    try {
      const query = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, reading_speed, theme_preference, practice_mode, notification_method, language_preference, languages_learning',
        [username, email, hashedPassword]
      );

      const {
        id,
        username: usernameDB,
        email: emailDB,
        reading_speed,
        theme_preference,
        practice_mode,
        notification_method,
        language_preference,
        languages_learning,
      } = query.rows[0];

      const token = jwt.sign({ id, usernameDB }, secret);
      const user = {
        id,
        username: usernameDB,
        email: emailDB,
        readingSpeed: reading_speed,
        themePreference: theme_preference,
        practiceMode: practice_mode,
        notificationMethod: notification_method,
        languagePreference: language_preference,
        languagesLearning: languages_learning,
      };
      const payload = { token, id, username };

      return res.cookie('accessToken', payload, cookie).status(200).send({
        user,
        message: 'Welcome to Polyglotist!',
      });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Error adding user' });
    }
  },

  loginUser: async (req: Request, res: Response) => {
    // Login user is called in 2 scenarios with 3 possible results: On application mounting and when the user requests to log in.
    // On mounting,
    // A). either the user has created an account beforehand and the user's cookie is still valid; so we access it and use its info to fetch the user info. If a user has an accessToken present in the browser, but the credentials are no longer valid for some reason, we must be able to provide the user with the ability to sign on using a different account (not just sign up); In this case, if the user has an access token, but also provides a username and password, then we go to scenario B.
    // B). or the user's cookie has expired or they have never made an account, and we log in with no cookies. OR the user has an access token but it no longer works for some reason, so the user provides a username and password while still having an access token.
    // C). When the user requests to login, we proceed to use their input to fetch the user

    // Scenaria A - get cookie and login user
    const { accessToken } = req.cookies;
    const { username, password: candidatePassword } = req.body;

    if (accessToken && (!username || !candidatePassword)) {
      try {
        const { username: usernameToken, token } = accessToken;

        const userQuery = await db.query(
          'SELECT id, username, email, theme_preference, reading_speed, practice_mode, notification_method, language_preference, languages_learning FROM users WHERE username = $1',
          [usernameToken]
        );

        const {
          id,
          username: usernameDB,
          email: emailDB,
          reading_speed,
          theme_preference,
          practice_mode,
          notification_method,
          language_preference,
          languages_learning,
        } = userQuery.rows[0];

        const sourcesQuery = await db.query(
          `SELECT source_id FROM users_sources WHERE user_id = $1 ORDER BY source_id ASC`,
          [id]
        );

        const sourceIds = sourcesQuery.rows;

        const sourceList = sourceIds
          ? await Promise.all(
              sourceIds.map(async (id: { source_id: string }) => {
                let srcId = id.source_id;

                let name = await db.query(
                  `SELECT name FROM sources WHERE id = $1`,
                  [srcId]
                );

                return name.rows[0].name;
              })
            )
          : [];

        const user = {
          id,
          username: usernameDB,
          email: emailDB,
          readingSpeed: reading_speed,
          themePreference: theme_preference,
          practiceMode: practice_mode,
          notificationMethod: notification_method,
          languagePreference: language_preference,
          languagesLearning: languages_learning,
          sources: sourceList,
        };

        jwt.verify(token, secret, {}, function (err: any, decoded: any) {
          if (err) {
            return res.status(401).send({ message: 'Please log in.' });
          } else {
            return res.status(200).send({
              user,
              message: 'Welcome Back!',
            });
          }
        });
      } catch (err) {
        console.log(err);
        return res.status(400).send({ message: 'Could not find the user.' });
      }
    } else {
      // Scenaria B - no cookie, or it has expired and login is called on Mount with no input
      if (!username || !candidatePassword) {
        const user = null;
        return res.status(200).send({ user });
      }

      // Scenario C - user calls login with inputs.
      try {
        const query = await db.query(
          'SELECT id, username, email, password, theme_preference, reading_speed, practice_mode, notification_method, language_preference, languages_learning FROM users WHERE username = $1',
          [username]
        );

        const {
          id,
          username: usernameDB,
          email: emailDB,
          password,
          reading_speed,
          theme_preference,
          practice_mode,
          notification_method,
          language_preference,
          languages_learning,
        } = query.rows[0];

        const sourcesQuery = await db.query(
          `SELECT source_id FROM users_sources WHERE user_id = $1 ORDER BY source_id ASC`,
          [id]
        );

        const sourceIds = sourcesQuery.rows;

        const sourceList = sourceIds
          ? await Promise.all(
              sourceIds.map(async (id: { source_id: string }) => {
                let srcId = id.source_id;

                let name = await db.query(
                  `SELECT name FROM sources WHERE id = $1`,
                  [srcId]
                );

                return name.rows[0].name;
              })
            )
          : [];

        const user = {
          id,
          username: usernameDB,
          email: emailDB,
          readingSpeed: reading_speed,
          themePreference: theme_preference,
          practiceMode: practice_mode,
          notificationMethod: notification_method,
          languagePreference: language_preference,
          languagesLearning: languages_learning,
          sources: sourceList,
        };

        const verifiedPassword = await bcrypt.compare(
          candidatePassword,
          password
        );

        if (verifiedPassword) {
          const token = jwt.sign({ id, username }, secret);

          const payload = { token, id, username };

          return res.cookie('accessToken', payload, cookie).status(200).send({
            user,
            message: 'Welcome Back!',
          });
        } else {
          return res.status(403).send({ message: 'Incorrect Password' });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).send({ message: 'User not found.' });
      }
    }
  },

  logoutUser: async (req: Request, res: Response) => {
    res.clearCookie('accessToken');
    return res.status(200).send({ message: 'Logged Out.' });
  },
};
