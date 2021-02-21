module.exports = (sequelize, DataTypes) => {
    let Post = sequelize.define('post', {
        postId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
        },
        postTitle: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        contents: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imgLink: {
            type: DataTypes.TEXT,
            allowNull: true
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

    return Post;
};