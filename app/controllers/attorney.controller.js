const db = require("../models");
const Lawyer = require("../models/attorney.model.js");
const Attorney = db.attorney;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const attorney = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    practice_area: req.body.practice_area,
    organizations: req.body.organizations,
    referred: req.body.referred,
    admitted: req.body.admitted,
    street_address: req.body.street_address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    courts: req.body.courts,
    month_year_joined: req.body.month_year_joined,
    longitude: req.body.longitude,
    latitude: req.body.latitude
  };
  // Save Case in the database
  Attorney.create(attorney)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating attorney."
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  Attorney.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving attorneys."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Attorney.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find attorney with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving attorney with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Attorney.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "case was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update case with id=${id}. Maybe case was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating case with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Attorney.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "case was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete case with id=${id}. Maybe case was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete case with id=" + id
      });
    });
};

