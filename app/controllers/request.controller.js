const db = require("../models");
const Request = db.request;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.agency) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Case
  const request = {
    agency: req.body.agency,
    agency_contacts: req.body.agency_contacts,
    agency_tracking_numbers: req.body.agency_tracking_numbers,
    current_status: req.body.current_status,
    category: req.body.category,
    subject: req.body.subject,
    short_description: req.body.short_description,
    keywords: req.body.keywords,
    submission_date: req.body.submission_date,
    response_limit: req.body.response_limit,
    acknowledgement_date: req.body.acknowledgement_date,
    response_deadline: req.body.response_deadline,
    expected_response_date: req.body.expected_response_date,
    actual_response_date: req.body.actual_response_date,
    appeal_limit: req.body.appeal_limit,
    appeal_deadlines: req.body.appeal_deadlines,
    initial_notes: req.body.initial_notes,
    determination: req.body.determination,
    records_received: req.body.records_received,
    urgent: req.body.urgent,
    overdue: req.body.overdue,
    related_request: req.body.related_request,
    documents: req.body.documents
  };

  // Save Request in the database
  Request.create(request)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the request."
      });
    });
};

exports.findAll = (req, res) => {
  const agency = req.query.agency;
  var condition = agency ? { agency: { [Op.like]: `%${agency}%` } } : null;
  Request.findAll({ where: condition })
    .then(data => {
      //console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

exports.getEvents = (req, res) => {
  const agency = req.query.agency;
  var condition = agency ? { agency: { [Op.like]: `%${agency}%` } } : null;

  Request.findAll({ where: condition })
    .then(data => {

      var events = [];
      for (const element of data) {
        var event = new Object();

        event.id = element.id;
        event.title = element.agency + ' , ' + element.case_id;

        var date = new Date(element.deadline);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);

        event.start = date;
        event.end = date;
        events.push(event);
      }
      res.send(events);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Request.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find request with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving request with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;
  Request.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "request was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update request with id=${id}. Maybe request was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating request with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Request.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "request was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete request with id=${id}. Maybe request was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete request with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Request.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} requests were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all requests."
      });
    });
};

exports.findAllActive = (req, res) => {
  Request.findAll({ where: { status: "Active" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

exports.findAllArchived = (req, res) => {
  Request.findAll({ where: { status: "Archived" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};

exports.findAllLitigation = (req, res) => {
  Request.findAll({ where: { status: "Litigation" } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving requests."
      });
    });
};