exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
