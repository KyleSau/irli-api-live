const express = require("express");
const cors = require("cors");
var nodemailer = require('nodemailer');

const app = express();
const db = require("./app/models");
const Role = db.role;
global.__basedir = __dirname;
const DROP_AND_RESYNC = false;

if (DROP_AND_RESYNC) {
  db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
  });
} else {
  db.sequelize.sync();
}

function initial() {

  Role.create({
    id: 1,
    name: "User"
  });

  Role.create({
    id: 2,
    name: "Moderator"
  });

  Role.create({
    id: 3,
    name: "Admin"
  });
}

var corsOptions = {
  origin: "http://localhost:8081"
};

//app.use(cors(corsOptions));
app.use(cors())

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to express application." });
});

require('./app/routes/court.routes')(app);
require('./app/routes/request.routes')(app);
require('./app/routes/contact.routes')(app);
require('./app/routes/attorney.routes')(app);
require('./app/routes/firm.routes')(app);
require('./app/routes/agency.routes')(app);
require('./app/routes/case.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/file.routes')(app);

const map = new Map();

//make sure to turn off strict mode
//SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION';

/*
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("data/requests.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();
    console.log("csvData.length: " + csvData.length);

    var array = [];
    for (var x in csvData) {

      var obj = csvData[x];
      //<br />
      var arr = [];

      // agency
      var agency = obj[1].split("<br />").join("\n");
      arr.push(agency);
      // short_description
      var short_description = obj[2].split("<br />").join("\n");
      arr.push(short_description);
      // ageny_tracking_numbers
      var agency_tracking_numbers = obj[3].split("<br />").join("\n");
      arr.push(agency_tracking_numbers);
      // current_status
      var current_status = obj[4].split("<br />").join("\n");
      arr.push(current_status);
      // category
      var category = obj[5].split("<br />").join("\n");
      arr.push(category);
      // subject
      var subject = obj[6].split("<br />").join("\n");
      arr.push(subject);

      // submission_date (date)
      var date_string = obj[8].split("<br />").join("\n");
      const date_array = date_string.split("/");
      var submission_date = new Date(date_array[2], date_array[0] - 1, date_array[1])
      arr.push(submission_date); //deadline

      // acknowledgement_date (date)
      var date_string2 = obj[10].split("<br />").join("\n");
      const date_array2 = date_string2.split("/");
      var acknowledgement_date = new Date(date_array2[2], date_array2[0] - 1, date_array2[1])
      arr.push(acknowledgement_date); //deadline

      // agency_contacts (json array)
      //var agency_contacts = obj[18]; //put this into a json array
      var agency_contacts = []
      var contact_names = obj[18].split("\n");

      for (var i in contact_names) {
        var name = contact_names[i];
        var contact = new Object();
        contact.name = name;
        if(name)
          agency_contacts.push(contact);
      }
      arr.push(JSON.stringify(agency_contacts));
      // records_received
      var records_received = obj[20].split("<br />").join("\n");
      arr.push(records_received)
      // urgent
      var urgent = obj[21].split("<br />").join("\n");
      arr.push(urgent)
      // overdue
      var overdue = obj[22].split("<br />").join("\n");
      arr.push(overdue)
      array.push(arr);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        //console.log(csvData);
        let query =
          "INSERT INTO requests (agency, short_description, agency_tracking_numbers, current_status, category, subject, submission_date, acknowledgement_date, agency_contacts, records_received, urgent, overdue) VALUES ?";
        connection.query(query, [array], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream.pipe(csvStream);*/


///////import CSV data
/*const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("data/lawsuits.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();
    console.log("csvData.length: " + csvData.length);

    var array = [];
    for (var x in csvData) {

      var obj = csvData[x];
      //<br />
      var arr = [];

      arr.push(obj[0]);
      arr.push(obj[1].split("<br />").join("\n"));
      arr.push(obj[2].split("<br />").join("\n"));
      arr.push(obj[3].split("<br />").join("\n"));
      arr.push(obj[4].split("<br />").join("\n"));

      var date_string = obj[5];
      const date_array = date_string.split("/");
      var deadline = new Date(date_array[2], date_array[0] - 1, date_array[1])
      //month, day, year from CSV
      //year, month, day is what database wants

      arr.push(deadline); //deadline
      arr.push(obj[7]); //lead plaintiff counsel
      arr.push(obj[8].split("<br />").join("\n")); //status
	arr.push(new Date());
	arr.push(new Date());

      //10 is updatedAt

      //console.log("deadline: " + Date.parse(obj[5]));

      array.push(arr);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        //console.log(csvData);
        let query =
          "INSERT INTO cases (case_name, description, staff_member, next_steps, document_type, deadline, lead_counsel, status, createdAt, updatedAt) VALUES ?";
        connection.query(query, [array], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream.pipe(csvStream);*/
///////end CSV data

/*const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("data/attorneys.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function (data) {
    csvData.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData.shift();
    console.log("csvData.length: " + csvData.length);
    var array = [];
    for (var x in csvData) {
      var obj = csvData[x];
      var arr = [];
      var name = obj[0];
      arr.push(name); //name
      //put into a map where attorney name is key, value is x
      map.set(name, x);
      arr.push(obj[1]); //email
      arr.push(obj[2]); //phone
      arr.push(obj[3].split("<br />").join("\n")); //practice area
      arr.push(obj[4].split("<br />").join("\n")); //organizations
      arr.push(obj[5].split("<br />").join("\n")); //referred
      arr.push(obj[6]); //admitted
      arr.push(obj[8]); //street_address
      arr.push(obj[10]); //city
      arr.push(obj[11]); //state
      arr.push(obj[12]); //zip
      arr.push(obj[14]); //latitude
      arr.push(obj[15]); //longitude
      arr.push(obj[18]); //month_year_joined'
      array.push(arr);
    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        //console.log(csvData);
        let query =
          "INSERT INTO attorneys (name, email, phone, practice_area, organizations, referred, admitted, street_address, city, state, zip, latitude, longitude, month_year_joined) VALUES ?";
        connection.query(query, [array], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream.pipe(csvStream);

let stream3 = fs.createReadStream("data/firms.csv");
let csvData3 = [];
let csvStream3 = fastcsv
  .parse()
  .on("data", function (data) {
    csvData3.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData3.shift();
    console.log("csvData: " + csvData3);

    var firms = [];
    for (var x in csvData3) {

      var obj = csvData3[x];

      var firm = [];

      firm.push(obj[0]); //firm name

      firm.push(obj[2]);//street
      firm.push(obj[4]);//city
      firm.push(obj[5]);//state
      firm.push(obj[6]);//zip

      firm.push(obj[8]);//latitude
      firm.push(obj[9]);//longitude
      firm.push(obj[10]);//website


      var attorneys = []
      var attorney_names = obj[11].split("\n");

      for (var i in attorney_names) {
        var name = attorney_names[i];
        var attorney = new Object();
        attorney.id = map.get(name);
        attorney.name = name;
        attorneys.push(attorney);
      }


      firm.push(JSON.stringify(attorneys));//attorneys
      console.log("attorneys: " + JSON.stringify(attorneys));

      firms.push(firm);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        console.log(firms);
        let query =
          "INSERT INTO firms (name, street, city, state, zip, latitude, longitude, website, attorneys) VALUES ?";
        connection.query(query, [firms], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream3.pipe(csvStream3);*/

/*const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream4 = fs.createReadStream("data/contacts.csv");
let csvData4 = [];
let csvStream4 = fastcsv
  .parse()
  .on("data", function (data) {
    csvData4.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData4.shift();
    console.log("csvData: " + csvData4);

    var contacts = [];
    for (var x in csvData4) {

      var obj = csvData4[x];

      var contact = [];
      contact.push(obj[1]); //title
      contact.push(obj[2]); //agency_contacts_name
      contact.push(obj[4]); //street
      contact.push(obj[6]); //city
      contact.push(obj[7]); //state
      contact.push(obj[8]); //zip
      contact.push(obj[12]); //phone
      contact.push(obj[13]); //2nd phone
      contact.push(obj[14]); //fax
      contact.push(obj[15]); //email
      contact.push(obj[16]); //agency name

      contacts.push(contact);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        console.log(contacts);
        //"Contact ID","Title","Agency Contacts Name","Address","Address : Street 1","Address : Street 2","Address : City","Address : State","Address : Zip","Address : Country","Address : Latitude","Address : Longitude","Phone","Second Phone","Fax","Email","Agency Name"
        let query =
          "INSERT INTO contacts (title, name, street_address, city, state, zip, primary_phone, secondary_phone, fax, email, agency_name) VALUES ?";
        connection.query(query, [contacts], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream4.pipe(csvStream4);*/


/*const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream5 = fs.createReadStream("data/agencies.csv");
let csvData5 = [];
let csvStream5 = fastcsv
  .parse()
  .on("data", function (data) {
    csvData5.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData5.shift();
    console.log("csvData: " + csvData5);

    var agencies = [];
    for (var x in csvData5) {

      var obj = csvData5[x];

      var agency = [];
      agency.push(obj[1]); //name
      agency.push(obj[2]); //description

      agencies.push(agency);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        console.log(agencies);
        let query =
          "INSERT INTO agencies (name, description) VALUES ?";
        connection.query(query, [agencies], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream5.pipe(csvStream5);*/

/*
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream5 = fs.createReadStream("data/courts.csv");
let csvData5 = [];
let csvStream5 = fastcsv
  .parse()
  .on("data", function (data) {
    csvData5.push(data);
  })
  .on("end", function () {
    // remove the first line: header
    csvData5.shift();
    console.log("csvData: " + csvData5);

    var agencies = [];
    for (var x in csvData5) {

      var obj = csvData5[x];

      var agency = [];
      agency.push(obj[0]); //name
      agency.push(obj[1]); //abbreviation

      agencies.push(agency);

    }
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: "irli"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        console.log(agencies);
        let query =
          "INSERT INTO courts (name, abbreviation) VALUES ?";
        connection.query(query, [agencies], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream5.pipe(csvStream5);*/

// set port, listen for requests
const PORT = process.env.PORT || 8080; //previously 8080 PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(__basedir + "/uploads/");
});

function emailDailyReports() {
  const Case = db.case;
  const User = db.user;
  const first_name = null;
  const case_name = null;
  var condition2 = case_name ? { case_name: { [Op.like]: `%${case_name}%` } } : null;
  var condition = first_name ? { first_name: { [Op.like]: `%${first_name}%` } } : null;
  var emails = [];
  Case.findAll({ where: condition2 })
    .then(data => {
      let today = new Date().toISOString().slice(0, 10);
      var markups = data.filter(item => item.deadline >= today)
      markups.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      console.log("markups " + JSON.stringify(markups));
      User.findAll({ where: condition })
        .then(data => {
          for (var x in data) {
            var user = data[x];
            console.log("report: " + user.reports);
            if (user.reports == "Yes") {
              emails.push(user.email);
            }
          }

          var style = " style=\"border: 1px solid black;\">";
          //table
          var html_string = "<html><body><table " + style;

          //headers
          html_string += "<th" + style + "Case Name</th>"
          html_string += "<th" + style + "Deadline</th>"
          html_string += "<th" + style + "Document Type</th>"

          for (var i in markups) {
            var markup = markups[i];
            //row
            html_string += "<tr " + style;

            //case name
            html_string += "<td " + style + "" + markup.case_name + "</td>";

            //deadline
            html_string += "<td " + style + "" + markup.deadline + "</td>";

            //document type
            html_string += "<td " + style + "" + markup.document_type + "</td>";

            //end row
            html_string += "</tr>";
          }
          html_string += "</table></body></html>";

          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'irliemails@gmail.com',
              pass: 'lwywbbmlqukbhsod' // previously password but because google required 2-Step Verification turned on app authentication
            }
          });

          var mailOptions = {
            from: 'irliemails@gmail.com',
            to: emails.toString(),
            subject: 'Litigation Daily Report',
            html: html_string
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        })
        .catch(err => {
        });
    });
}

function runAtSpecificTimeOfDay(hour, minutes, func)
{
  const twentyFourHours = 86400000;
  const now = new Date();
  let eta_ms = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minutes, 0, 0).getTime() - now;
  if (eta_ms < 0)
  {
    eta_ms += twentyFourHours;
  }
  setTimeout(function() {
    //run once
    func();
    // run every 24 hours from now on
    setInterval(func, twentyFourHours);
  }, eta_ms);
}

runAtSpecificTimeOfDay(12,0,() => { emailDailyReports() });