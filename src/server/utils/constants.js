const thirtyDayCookie = {
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  httpOnly: true,
  secure: true,
  sameSite: true,
};

module.exports = thirtyDayCookie;
