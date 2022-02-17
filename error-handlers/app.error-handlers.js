exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};

exports.customErrors = (err, req, res, next) => {
  if (!err.status) return next(err);
  res.status(err.status).send({ msg: err.msg });
};

exports.psqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid article ID" });
  }
  if (err.code === "23502") {
    return res.status(400).send({ msg: "Missing data in request body" });
  }
  if (err.code === "23503") {
    if (err.detail.search(/article_id/) !== -1) {
      return res.status(404).send({ msg: "Article ID not found" });
    }
    if (err.detail.search(/author/) !== -1) {
      return res.status(404).send({ msg: "Username not found" });
    }
  }
  next(err);
};

exports.serverError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};
