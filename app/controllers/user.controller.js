const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.create = (req, res) => {
  // Save User to Database
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    access: req.body.access,
    reports: req.body.reports
  })

    .then(user => {
      var roles = []
      roles.push(req.body.role);
      if (roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            console.log(roles);
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
exports.getAll = (req, res) => {
  const first_name = req.query.first_name;
  var condition = first_name ? { first_name: { [Op.like]: `%${first_name}%` } } : null;
  User.findAll({ where: condition })
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};
exports.getById = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find user with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving user with id=" + id
      });
    })

};

exports.update = (req, res) => {
  const id = req.params.id;
  if (req.body.password)
    req.body.password = bcrypt.hashSync(req.body.password, 8);
  User.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "user was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating user with id=" + id
      });
    })
  User.findByPk(id).then(user => {
    var roles = []
    roles.push(req.body.role);
    if (roles) {
      Role.findAll({
        where: {
          name: {
            [Op.or]: roles
          }
        }
      }).then(roles => {
        user.setRoles(roles).then(() => {
          console.log(roles);
        });
      });
    }
  })
    .catch(err => {
      //res.status(500).send({ message: err.message });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "user was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete user with id=${id}. Maybe user was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete user with id=" + id
      });
    });
};