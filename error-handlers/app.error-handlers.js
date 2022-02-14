exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (!err.status) return next(err);
  res.status(err.status).send({ msg: err.msg });
};

exports.invalidItemId = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid item ID" });
  }
  next(err);
};

exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
