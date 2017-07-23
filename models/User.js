exports.User = function(Sequelize, sequelize) {
    return sequelize.define('User', {
        UID: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        PACCOUNT: { type: Sequelize.TEXT, unique: true },
        ACCESS_TOKEN: Sequelize.TEXT,
        REFRESH_TOKEN: Sequelize.TEXT,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
    }, {
        tableName: 'pixnet_user'
    });
};