const express = require('express');
const deleteRoutes = express.Router();
const passport = require('passport');
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const config = require("./db.js");
const db = mysql.createConnection(config);

deleteRoutes.post('/deleteproject', function (req, res, next) {
    var id_project = req.body.id_project;
    db.query("DELETE FROM bioblocks.user_belongs_project WHERE id_project=?", [id_project], function (err, rows, fields) {
        if (err) throw err;
        db.query("DELETE FROM bioblocks.project_belongs_group WHERE id_project=?", [id_project], function (err, rows, fields) {
            if (err) throw err;
            db.query("DELETE FROM bioblocks.project WHERE id_project=?", [id_project], function (err, rows, fields) {
                if (err) throw err;
                return res.send({ success: true, message: 'project deleted' })
            });
        });
    });
});

deleteRoutes.post('/deletegroup', function (req, res, next) {
    var id_group = req.body.id_group;
    db.query("DELETE FROM bioblocks.project_belongs_group WHERE id_group=?", [id_group], function (err, rows, fields) {
        if (err) throw err;
        db.query("DELETE FROM bioblocks.projects_group WHERE id_group=?", [id_group], function (err, rows, fields) {
            if (err) throw err;
            return res.send({ success: true, message: 'group deleted' })
        });
    });
});

module.exports = deleteRoutes;