module.exports = (sequelize, DataTypes) => {
    let Member = sequelize.define('member', {
        memId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
        },
        memUserId: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        memEmail: {
            type: DataTypes.STRING(40),
            allowNull: false,
            unique: true,
        },
        name: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        nick: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sex: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(25),
            allowNull: true
        },
        memAuth: {
            type: DataTypes.INTEGER,
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

    return Member;
};