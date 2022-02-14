exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (!err.status) return next(err);
  res.status(err.status).send({ msg: err.msg });
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
