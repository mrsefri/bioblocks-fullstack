const express = require('express');
const postRoutes = express.Router();
const passport = require('passport');
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const config = require("./db.js");
const db = mysql.createConnection(config);

postRoutes.post('/signin', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.send({ success: false, message: 'authentication failed' }); }
        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.send({ success: true, message: 'authentication success' });
        });
    })(req, res, next);
});

postRoutes.post('/signup', function (req, res, next) {
    var salt = bcrypt.genSaltSync(10); //10 rounds to apply with the hash function module bcrypt provides. View module bcrypt docs on npm  
    var password = bcrypt.hashSync(req.body.password, salt); //Passport encrypted 
    //Getting the params user taps and storing in a json object 
    var user = {
        full_name: req.body.fullName,
        username: req.body.username,
        password: password,
        email: req.body.email,
        user_type: req.body.userType
    };
    /*Inserting data on the db */
    db.query("INSERT INTO bioblocks.user SET ? , `creation_date` = current_date()", user, (err, rows, fields) => {
        if (err) throw err;
    });
    return res.send({ success: true, message: 'register success' });
});

postRoutes.post('/newproject', function (req, res, next) {
    var id = req.user.id_user //user is a variable that is on the request of the HTTP with this params: id_user, username, password and full_name 
    /*Getting the params that the user type onn the form*/
    var name = req.body.project_name
    var public = req.body.public //'Public' has two values 0 or 1, so the best way of doing this is with a checkbox
    var xml_file = "<xml xmlns='http://www.w3.org/1999/xhtml'><variables></variables></xml>";
    if (req.body.xml_file != "") {
        xml_file = req.body.xml_file;
    }
    if (public) {
        var publicint = 1
    } else {
        var publicint = 0
    }
    /*When creating a project, the owner is automatically added on the project ('user_belongs_project' table)*/
    /* Storing the new project in the db */
    db.query("INSERT INTO bioblocks.project (name, creation_date, last_modification,public,owner, xml_file) VALUES( ? , current_date() , now(),?,?,?)", [name, publicint, id, xml_file], function (err, rows, fields) {
        if (err) throw err;

    });
    /*Getting the id of the project we just created*/
    var id_project = '';
    db.query("SELECT project.id_project FROM project WHERE project.id_project = (SELECT MAX( id_project )  FROM project)", function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0)
            id_project = rows[0].id_project
        /*Storing the owner of the project in user_belongs_project */
        db.query("INSERT INTO user_belongs_project (id_user,id_project) VALUES (?,?)", [id, id_project], function (err, rows, fields) {
            if (err) throw err;
        });

        return res.send({ success: true, message: 'project created', uri: id_project })
    });
});

postRoutes.post('/search/projects', function (req, res, next) {
    var patron = req.body.q;
    var projectList = [];
    var i = 0;
    db.query("SELECT id_project,name, (SELECT full_name FROM user WHERE id_user=owner) AS owner from project where project.name LIKE '%" + patron + "%' AND public=1", function (err, rows, fields) {
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

postRoutes.post('/newgroup', function (req, res, next) {
    var id = req.user.id_user;
    var name = req.body.group_name; //Getting the name of the group from the form 
    db.query("INSERT INTO bioblocks.projects_group (name, owner) VALUES( ?, ? )", [name, id], function (err, rows, fields) {
        if (err) throw err;
    });
    /*Getting the id of the group we just created*/
    var id_group = '';
    db.query("SELECT projects_group.id_group FROM projects_group WHERE projects_group.id_group = (SELECT MAX( id_group )  FROM projects_group)", function (err, rows, fields) {
        if (err) throw err;
        if (rows.length > 0)
            id_group = rows[0].id_group

        return res.send({ success: true, message: 'group created', uri: id_group });
    });
});

postRoutes.post('/projectToGroup', function (req, res, next) {
    var id_project = req.body.id_project;
    var id = req.body.id_group;
    db.query("INSERT INTO project_belongs_group (id_project,id_group) VALUES (?,?)", [id_project, id], function (err, rows, fields) {
        if (err) throw err;
    });
    return res.send({ success: true, message: 'project added' })
});

postRoutes.post('/userToProject', function (req, res, next) {
    var id_project = req.body.id_project;
    var id = req.body.id_user;
    db.query("SELECT * FROM user WHERE id_user=?", [id], function (err, rows, fields) {
            if (err) throw err;
            console.log(rows.length);
            if (rows.length > 0) {
                db.query("INSERT INTO user_belongs_project (id_user,id_project) VALUES (?,?)", [id, id_project], function (err, rows, fields) {
                    if (err) throw err;
                });
                return res.send({ success: true, message: 'user added to project' })
            }
            return res.send({ success: false, message: 'user not added to project' })
        });
});

module.exports = postRoutes;