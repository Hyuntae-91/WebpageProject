module.exports = (sequelize, DataTypes) => {
    let Comment = sequelize.define('comment', {
        commentId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
        },
        contents: {
            type: DataTypes.STRING(255),
            allowNull: false
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
    },{
        charset: 'utf8',
        collate: 'utf8_unicode_ci'
    });

    return Comment;
};

// TODO: 대댓글 구현?