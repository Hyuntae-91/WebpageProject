const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.databse, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// TODO: 삭제시 DB에서 삭제시키지 말고, Delete 변수를 하나 두자.
db.Member = require('./member')(sequelize, Sequelize);
db.Forum = require('./forum')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);
db.Notice = require('./notice')(sequelize, Sequelize);
db.PostRecommend = require('./postRecommend')(sequelize, Sequelize);

////////////////////////////////////////////////// Association //////////////////////////////////////////////////
db.Member.hasMany(db.Post, {foreignKey: 'memId', sourceKey: 'memId'});
db.Post.belongsTo(db.Member, {foreignKey: 'memId', targetKey: 'memId'});

db.Member.hasMany(db.Comment, {foreignKey: 'memId', sourceKey: 'memId'});
db.Comment.belongsTo(db.Member, {foreignKey: 'memId', targetKey: 'memId'});

db.Forum.hasMany(db.Post, {foreignKey: 'forumId', sourceKey: 'forumId'});
db.Post.belongsTo(db.Forum, {foreignKey: 'forumId', targetKey: 'forumId'});

db.Forum.hasMany(db.Comment, {foreignKey: 'forumId', sourceKey: 'forumId'});
db.Comment.belongsTo(db.Forum, {foreignKey: 'forumId', targetKey: 'forumId'});

db.Forum.hasOne(db.Notice, {foreignKey: 'forumId', sourceKey: 'forumId'});
db.Notice.belongsTo(db.Forum, {foreignKey: 'forumId', targetKey: 'forumId'});

db.Post.hasMany(db.Comment, {foreignKey: 'postId', sourceKey: 'postId'});
db.Comment.belongsTo(db.Post, {foreignKey: 'postId', targetKey: 'postId'});

db.Post.hasOne(db.Notice, {foreignKey: 'postId', sourceKey: 'postId'});
db.Notice.belongsTo(db.Post, {foreignKey: 'postId', targetKey: 'postId'});


// Recommend assosciation
db.Member.hasOne(db.PostRecommend, {foreignKey: 'memId', sourceKey: 'memId'});
db.PostRecommend.belongsTo(db.Member, {foreignKey: 'memId', targetKey: 'memId'});
/*
db.forum.hasMany(db.PostLike, {foreignKey: 'forumId', sourceKey: 'forumId'});
db.PostLike.belongsTo(db.forum, {foreignKey: 'forumId', targetKey: 'forumId'});
*/
db.Post.hasMany(db.PostRecommend, {foreignKey: 'postId', sourceKey: 'postId'});
db.PostRecommend.belongsTo(db.Post, {foreignKey: 'postId', targetKey: 'postId'});


////////////////////////////////////////////////// Association //////////////////////////////////////////////////


module.exports = db;