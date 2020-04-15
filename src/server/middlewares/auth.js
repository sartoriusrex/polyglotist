module.exports = {
  checkAuth: (req, res, next) => {
    const accessToken = req.cookies ? req.cookies.accessToken : null;

    if (accessToken) {
      res.locals.accessToken = accessToken;

      next()
    } else {
      res
        .status(403)
        .send({ message: 'Forbidden. Please login with valid credentials.' })
    }
  }
}