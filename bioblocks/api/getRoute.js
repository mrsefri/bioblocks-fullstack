const express = require('express');
const getRoutes = express.Router();
const passport = require('passport');
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const config = require("./db.js");
const db = mysql.createConnection(config);

getRoutes.get('/isLoggedIn', function (req, res, next) {
    if (req.user == undefined)
        return res.send({ success: false, message: 'user login' });
    var id = req.user.id_user;
    if (req.isAuthenticated()) {
        db.query("SELECT user.user_type FROM user WHERE id_user=?", [id], function (err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0)
                return res.send({ success: true, message: 'user login', name: req.user.full_name, type: rows[0].user_type });
        });
    }
    else
        return res.send({ success: false, message: 'user login' });
});

getRoutes.get('/logout', function (req, res, next) {
    req.logOut();
    return res.send({ success: true, message: 'user logout' });
});

getRoutes.get('/MyHomeProjects', function (req, res, next) {
    var id = req.user.id_user;
    var projectList = [];
    var i = 0;
    db.query("SELECT project.id_project,project.name, (SELECT full_name FROM user WHERE id_user=?) AS owner FROM project WHERE project.id_project IN (SELECT id_project FROM bioblocks.user_belongs_project "
        + "WHERE id_user=?) LIMIT 3", [id,id], function (err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                while (rows[i] != null) {
                    projectList.push(rows[i])
                    i++;
                }
            }
            return res.send(projectList);
        });
});

getRoutes.get('/AllMyProjects', function (req, res, next) {
    var id = req.user.id_user;
    var projectList = [];
    var i = 0;
    db.query("SELECT project.id_project,project.name, (SELECT full_name FROM user WHERE id_user=owner) AS owner FROM project WHERE project.id_project IN (SELECT id_project FROM bioblocks.user_belongs_project "
        + "WHERE id_user=?)", [id], function (err, rows, fields) {
            if (err) throw err;
            if (rows.length > 0) {
                while (rows[i] != null) {
                    projectList.push(rows[i])
                    i++;
                }
            }
            return res.send(projectList);
        });
});

getRoutes.get('/MyHomeGroups', function (req, res, next) {
    var id = req.user.id_user;
    var groupList = [];
    var i = 0;
    db.query("SELECT name,id_group FROM projects_group WHERE owner=? LIMIT 3", [id], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            while (rows[i] != null) {
                groupList.push(rows[i])
                i++;
            }
        }
        return res.send(groupList);
    });
});

getRoutes.get('/AllMyGroups', function (req, res, next) {
    var id = req.user.id_user;
    var groupList = [];
    var i = 0;
    db.query("SELECT name,id_group FROM projects_group WHERE owner=?", [id], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            while (rows[i] != null) {
                groupList.push(rows[i])
                i++;
            }
        }
        return res.send(groupList);
    });
});

getRoutes.get('/projectsGroup', function (req, res, next) {
    var id_group = req.body.id_group;
    var i = 0;
    var projects = [];
    db.query("SELECT id_project,name FROM project WHERE id_project IN (SELECT id_project from project_belongs_group WHERE id_group=?)", [id_group], function (err, rows, fields) {
        if (rows.length > 0) {
            while (rows[i] != null) {
                projects.push(rows[i])
                i++;
            }
        }
        return res.send(projects);
    });
});

getRoutes.get('/project/:id', function (req, res, next) {
    var id = req.params.id;
    var id_user = req.user.id_user;
    var i = 0;
    db.query("SELECT project.id_project, project.name, project.public, owner, CONVERT(project.xml_file USING utf8) as xml_file FROM project WHERE project.id_project=?", [id], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0) {
            if (id_user == rows[0].owner) {
                return res.send({ info: rows[0], isOwner: true })
            }
            else {
                db.query("SELECT * FROM user_belongs_project WHERE user_belongs_project.id_project=? AND user_belongs_project.id_user=?", [id, id_user], function (err, rows, fields) {
                    if (err) throw err;
                    if (rows.length > 0)
                        return res.send({ info: rows[0], isOwner: true })
                    else
                        return res.send({ info: rows[0], isOwner: false })
                });
            }
        }
        else
            return res.send(null)
    });
});

getRoutes.get('/group/:id', function (req, res, next) {
    var id = req.params.id;
    var i = 0;
    db.query("SELECT projects_group.name FROM projects_group WHERE projects_group.id_group=?", [id], function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0)
            return res.send(rows[0])
        else
            return res.send(null)
    });
});

module.exports = getRoutes;