exports.Products = function(Sequelize, sequelize) {
    return sequelize.define('Products', {
        product_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        category: Sequelize.STRING(15),
        product_name: Sequelize.STRING(20),
        article_title: Sequelize.STRING(150),
        article_link: Sequelize.STRING(100),
        published: Sequelize.STRING(12),
        popularity: Sequelize.INTEGER,
        user_name: Sequelize.STRING(50),
        price: Sequelize.STRING(10),
        isOpen: Sequelize.STRING(10),
        description: Sequelize.STRING(500)
    }, {
        tableName: 'products',
        timestamps: false
    });
};