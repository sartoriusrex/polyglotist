import { Request, Response, NextFunction } from 'express';

export default {
  checkAuth: (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies ? req.cookies.accessToken : null;

    if (accessToken) {
      res.locals.accessToken = accessToken;

      next();
    } else {
      res
        .status(403)
        .send({ message: 'Forbidden. Please login with valid credentials.' });
    }
  },
};
