function setHeaderQuery(req, res, next) {
  req.query.limit = 3;
  req.query.sort = "-price";
  next();
}

module.exports = { setHeaderQuery };
