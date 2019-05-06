const express = require('express');
const putRoutes = express.Router();
const passport = require('passport');
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const config = require("./db.js");
const db = mysql.createConnection(config);

putRoutes.put('/saveproject', function (req, res, next) {
    var id = req.body.id_project; //In future releases the project's author needs to be checked
    /*Getting the project that the user has saved*/
    var xml_file = req.body.xml_file;
    /*When saving a project, the previous project version is deleted*/
    /* Storing the saved project in the db */
    db.query("UPDATE bioblocks.project SET xml_file = ? WHERE id_project = ?", [xml_file, id], function (err, rows, fields) {
        if (err) throw err;
    });
    /*Sending that the call was successful*/
    return res.send({ success: true, message: 'project saved' });
});

putRoutes.put('/editproject', function (req, res, next) {
    var id = req.body.id_project;
    var name = req.body.name;
    var public = req.body.public;
    var project_group = req.body.project_group;
    db.query("UPDATE bioblocks.project SET name = ?, public = ? WHERE id_project = ?", [name, public, id], function (err, rows, fields) {
        if (err) throw err;
        if (project_group != "") {
            db.query("SELECT projects_group.name FROM projects_group WHERE projects_group.id_group=?", [project_group], function (err, rows, fields) {
                if (err) throw err;
                if (rows.length > 0) {
                    db.query("INSERT INTO project_belongs_group (id_project,id_group) VALUES (?,?)", [id, project_group], function (err, rows, fields) {
                        if (err) throw err;
                    });
                    return res.send({ success: true, message: 'project edited' });
                }
                return res.send({ success: false, message: 'project not edited' });
            });
        }
    });
});

putRoutes.put('/editgroup', function (req, res, next) {
    var id = req.body.id_group;
    var name = req.body.name;
    db.query("UPDATE bioblocks.projects_group SET name = ? WHERE id_group = ?", [name, id], function (err, rows, fields) {
        if (err) throw err;
    });
    /*Sending that the call was successful*/
    return res.send({ success: true, message: 'group edited' });
});


module.exports = putRoutes;