/// <reference path="../global.d.ts"/>

import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

import bcrypt from 'bcryptjs';
import db from '../database';
import { Request, Response } from 'express';
import { 
  select_all_from_all_users, 
  select_all_from_user_from_username, 
  select_id_from_users_from_username, 
  update_email, 
  update_password,
  update_username, 
  update_user_settings,
  delete_user_source,
  select_id_from_source_from_name,
  insert_user_sources,
  select_name_from_sources_from_id,
  delete_user,

} from '../queries';

const salt = 10;

export default {
  getAllUsers: async (req: Request, res: Response) => {
    try {
      const response = await db.query(
        select_all_from_all_users
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
        select_all_from_user_from_username,
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
          update_username,
          [updatedName, username]
        );

        user.username = newUsername.rows[0];
      }

      if (email) {
        const newEmail = await db.query(
          update_email,
          [email, username]
        );

        user.email = newEmail.rows[0];
      }

      if (password) {
        const hashedPassword = await bcrypt.hash(password, salt);
        const newPassword = await db.query(
          update_password,
          [hashedPassword, username]
        );

        user.password = newPassword.rows[0];
      }

      if (settings.length > 0) {
        const newSettings = await db.query(
          update_user_settings,
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
          select_id_from_users_from_username,
          [username]
        );
        const userId = userIdQuery.rows[0].id;

        // Delete all user source associations
        const currentSourcesIds = await db.query(
          delete_user_source,
          [userId]
        );

        // Multistep Promise function - convert source names to ids, insert those ids into users_ids, then query those same ids for actual db values instead of relying on the inputs.
        const newSources: any = await Promise.all(
          // convert array of source names to pgsql source ids
          sources.map(async (srcName: string) => {
            try {
              return await db.query(
                select_id_from_source_from_name, 
                [srcName]
              );
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
                    insert_user_sources,
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
                    select_name_from_sources_from_id,
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
      const mutation = await db.query(
        delete_user,
        [username,]
      );

      return res
        .status(200)
        .send({ message: `Successfully deleted user ${mutation.rows[0]}` });
    } catch (err) {
      return res.status(400).send({ message: 'Error deleting user' });
    }
  },
};
