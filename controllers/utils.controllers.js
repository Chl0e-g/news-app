const { fetchEndpoints } = require("../models/utils.models");

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
