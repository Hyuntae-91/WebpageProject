module.exports = (sequelize, DataTypes) => {
    let Notice = sequelize.define('notice', {
        noticeId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
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

    return Notice;
};