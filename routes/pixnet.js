var API_KEY = 'API_KEY';
var secret = 'SECRET';
var DOMAIN = 'DOMAIN';
var local = require("../config/local");
var redirect_uri = DOMAIN + '/callback';
var request = require('request');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    local.model.mysql.database,
    local.model.mysql.account,
    local.model.mysql.password,
    local.model.mysql.options
);
var User = require("../models/User").User(Sequelize, sequelize);
var Products = require("../models/Products").Products(Sequelize, sequelize);
exports.getAuthUrl = function(req, res) {
    req.session.account = req.params.account;
    var url = 'https://emma.pixnet.cc/oauth2/authorize?redirect_uri=' + redirect_uri + '&client_id=' + API_KEY + '&response_type=code';
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(url);
};
exports.listUsers = function(req, res) {
    User.findAll().then(function(users) {
        res.json(users);
    }).catch(function(err) {
        console.log(err);
    })
};
exports.callback = function(req, res) {
    if (req.query.code) {
        var tokenUrl = 'https://emma.pixnet.cc/oauth2/grant?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + redirect_uri + '&client_id=' + API_KEY + '&client_secret=' + secret;
        request.get(tokenUrl, function(e, r, body) {
            body = JSON.parse(body);
            req.session.access_token = body.access_token;
            var accUrl = 'https://emma.pixnet.cc/account?access_token=' + body.access_token;
            request.get(accUrl, function(err, rr, acc) {
                req.session.user = JSON.parse(acc).account.name;
            });
            var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(output);
        });
    } else {
        var output = '<html><head></head><body onload="window.close();">Close this window</body></html>';
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(output);
    }

};
exports.permission = function(req, res) {
    if (req.session.access_token)
        res.json({ status: true, user: req.session.user });
    else
        res.json({ status: false });
};
exports.submitPost = function(req, res) {
    var options = {
        method: 'POST',
        url: 'https://emma.pixnet.cc/blog/articles',
        headers: { 'content-type': 'multipart/form-data' },
        formData: req.body
    };
    options.formData.access_token = req.session.access_token;
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        var form = req.body;
        var post = JSON.parse(body);
        Products.findAll().then(function(data) {
            form.product_id = data.length + 1;
            form.article_link = post.article.link;
            form.user_name = post.article.user.name;
            Products.build(form)
                .save().then(function(Product) {
                    post.product_id = Product.dataValues.product_id;
                    res.json(post);
                    console.log(post);
                }).catch(function(err) {
                    console.log(err);
                })
        });
    });
};

exports.checkUser = function(req, res) {
    if (req.params.user == req.session.user) {
        res.redirect('http://140.112.26.241/buyit/index.html');
    } else res.redirect('http://140.112.26.241/buyit/index.html');
}

function getAccessToken(username) {
    var query = {
        where: {
            PACCOUNT: username
        }
    }
    User.find(query).then(function(user) {
        if (user) {
            var t = user.updatedAt.split(/[- : T .]/) //t=[Y, M, D, H, M, S]
            var tokenExpireTime = new Date(t[0], t[1] - 1, t[2], t[3] - 0 + 8 + 1, t[4], t[5]);
            if (new Date() > tokenExpireTime) {
                //token expired
                var token = refreshToken(username, user.refresh_token);
                if (token) return token;
            } else {
                return user.access_token
            }
        } else {
            //user not found
        }
    }).catch()
}

function refreshToken(username, refresh_token) {
    var url = 'https://emma.pixnet.cc/oauth2/grant?grant_type=refresh_token&refresh_token=' + refresh_token + '&client_id=' + API_KEY + '&client_secret=' + secret;
    request.get(tokenUrl, function(e, r, body) {
        var acctoken = JSON.parse(acc).access_token;
        User.upsert({ PACCOUNT: username, ACCESS_TOKEN: acctoken }).then(function(u) {
            return acctoken;
        }).catch(function(err) {
            console.log(err);
        });
    })
}

exports.getIdByName = function(req, res) {
    var query = {
        where: {
            product_name: req.params.name
        }
    }
    Products.find(query).then(function(product) {
        res.json(product)
    }).catch(function(err) {

    });
}