module.exports = (sequelize, DataTypes) => {
    let PostRecommend = sequelize.define('postRecommend', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull : false,
            primaryKey: true,
            autoIncrement: true
        },
        likedIp: { // 사용하지 않는 컬럼. 비로그인 관련 기능 수정시 사용하기 위해 미리 생성
            type: DataTypes.STRING(25),
            allowNull: true
        },
        like: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        dislike: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        clickedTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: new Date()
        }
    }, {
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: false
    });

    return PostRecommend;
};