/// <reference path="../global.d.ts"/>

import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

import bcrypt from 'bcryptjs';
import db from '../database';
import { Request, Response } from 'express';

const salt = 10;

export default {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const response = await db.query(
        'SELECT * FROM users ORDER BY username ASC'
      );

      const usersArray = response.rows;

      // Map over usersArray and return the same items, without the passwords
      const users = usersArray.map(
        (user: { id: string; email: string; username: string }) => {
          return {
            id: user.id,
            email: user.email,
            username: user.username,
          };
        }
      );

      return res.status(200).send({ users });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Error getting all users' });
    }
  },

  getOneUser: async (req: Request, res: Response) => {
    const username = parseInt(req.params.username, 10);

    try {
      const response = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );

      return res.status(200).send({ user: response.rows });
    } catch (err) {
      return res.status(400).send({ message: 'Error getting user' });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const username = req.params.username;
    const {
      updatedName,
      email,
      password,
      readingSpeed,
      themePreference,
      practiceMode,
      notificationMethod,
      languagePreference,
      languagesLearning,
      sources,
    } = req.body;
    const settings = [
      readingSpeed,
      themePreference,
      practiceMode,
      notificationMethod,
      languagePreference,
      languagesLearning,
    ];
    let user: any = {};

    try {
      if (updatedName) {
        const newUsername = await db.query(
          'UPDATE users SET username = $1 WHERE username = $2 RETURNING username',
          [updatedName, username]
        );

        user.username = newUsername.rows[0];
      }

      if (email) {
        const newEmail = await db.query(
          'UPDATE users SET email = $1 WHERE username = $2 RETURNING email',
          [email, username]
        );

        user.email = newEmail.rows[0];
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, salt);
        const newPassword = await db.query(
          'UPDATE users SET password = $1 WHERE username = $2 RETURNING password',
          [hashedPassword, username]
        );

        user.password = newPassword.rows[0];
      }

      if (settings.length > 0) {
        const newSettings = await db.query(
          'UPDATE users SET reading_speed = $1, theme_preference = $2, practice_mode = $3, notification_method = $4, language_preference = $5, languages_learning = $6 WHERE username = $7 RETURNING id, reading_speed, theme_preference, practice_mode, notification_method, language_preference, languages_learning',
          [
            readingSpeed,
            themePreference,
            practiceMode,
            notificationMethod,
            languagePreference,
            languagesLearning,
            username,
          ]
        );

        const {
          id,
          reading_speed,
          theme_preference,
          practice_mode,
          notification_method,
          language_preference,
          languages_learning,
        } = newSettings.rows[0];

        user.readingSpeed = reading_speed;
        user.themePreference = theme_preference;
        user.practiceMode = practice_mode;
        user.notificationMethod = notification_method;
        user.languagePreference = language_preference;
        user.languagesLearning = languages_learning;
      }

      if (sources && sources.length > 0) {
        const userIdQuery = await db.query(
          `SELECT id FROM users WHERE username = $1`,
          [username]
        );
        const userId = userIdQuery.rows[0].id;

        // Delete all user source associations
        const currentSourcesIds = await db.query(
          `DELETE FROM users_sources WHERE user_id = $1`,
          [userId]
        );

        // Multistep Promise function - convert source names to ids, insert those ids into users_ids, then query those same ids for actual db values instead of relying on the inputs.
        const newSources: any = await Promise.all(
          // convert array of source names to pgsql source ids
          sources.map(async (srcName: string) => {
            try {
              return await db.query('SELECT id FROM sources WHERE name = $1', [
                srcName,
              ]);
            } catch (err) {
              console.log(
                err,
                ' Line 145 users handler, converting src names to ids'
              );
            }
          })
        )
          .then((sourceIds: any[]) => {
            // Map through new array of ids and insert them into users_sources table
            return Promise.all(
              sourceIds.map(async (srcId: { rows: any[] }) => {
                let { id } = srcId.rows[0];

                try {
                  return await db.query(
                    `INSERT INTO users_sources (user_id, source_id) VALUES
                  ($1, $2) RETURNING source_id`,
                    [userId, id]
                  );
                } catch (err) {
                  console.log(
                    err,
                    ' Error inserting into users_sources table line 161 users handler'
                  );
                }
              })
            );
          })
          .then((ids: any[]) => {
            // Convert newSourceIds back into their names
            return Promise.all(
              ids.map(async (id: any) => {
                let srcId = id.rows[0].source_id;

                try {
                  let result = await db.query(
                    `SELECT name FROM sources WHERE id = $1`,
                    [srcId]
                  );
                  return result.rows[0].name;
                } catch (err) {
                  console.log(
                    err,
                    'Error line 178, mapping new source ids to their names'
                  );
                }
              })
            );
          })
          .catch((err: any) => {
            console.log(err, ' Error in updating users_sources');
          });

        user.sources = newSources;
      }

      return res
        .status(200)
        .send({ user, message: 'Successfully Updated Settings & Preferences' });
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'Error updating user' });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    const username = req.params.username;

    try {
      const mutation = await db.query('DELETE FROM users WHERE username = $1', [
        username,
      ]);

      return res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.rows[0]}` });
    } catch (err) {
      return res.status(400).send({ message: 'Error deleting user' });
    }
  },
};
