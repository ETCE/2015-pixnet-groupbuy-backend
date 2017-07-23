var sslEnabled = false;
var path = require('path');
module.exports = {
    model: {
        mysql: {
            database: "DATABASENAME",
            account: "ACCOUNT",
            password: "PASSWORD",
            options: {
                host: "HOST",
                port: undefined,
                logging: false
            }
        }
    }
}