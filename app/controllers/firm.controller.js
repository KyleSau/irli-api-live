const db = require("../models");
const Firm = db.firm;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const firm = {
    name: req.body.name,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    website: req.body.website,
    attorneys: req.body.attorneys
  };
  // Save Case in the database
  Firm.create(firm)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating firm."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Firm.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving firms."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Firm.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find firm with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving firm with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Firm.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "firm was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update firm with id=${id}. Maybe firm was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating firm with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Firm.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "firm was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete firm with id=${id}. Maybe firm was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete firm with id=" + id
      });
    });
};

