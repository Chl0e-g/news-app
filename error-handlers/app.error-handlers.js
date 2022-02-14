exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.serverError = (err, req, res, next) => {
    console.log("In the server error")
  res.status(500).send({ msg: "Internal server error" });
};
