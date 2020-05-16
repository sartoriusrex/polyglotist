import * as dotenv from 'dotenv';
dotenv.config({ path: `${__dirname}/.env` });

const thirtyDayCookie = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false,
  sameSite: true,
};

export default thirtyDayCookie;
