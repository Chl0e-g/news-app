exports.invalidPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
