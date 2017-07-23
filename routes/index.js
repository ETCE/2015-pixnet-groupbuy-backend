var request = require('request');
/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('pixnet_new_article.ejs');
};

exports.button = function(req, res) {
    res.render('button_callback.ejs');
};