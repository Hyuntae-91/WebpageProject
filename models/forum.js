module.exports = (sequelize, DataTypes) => {
    let Forum = sequelize.define('forum', {
        forumId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
        },
        forumTitle: {
            type: DataTypes.STRING(30),
            allowNull: false,
        }, 
        forumAuth: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });

    return Forum;
};