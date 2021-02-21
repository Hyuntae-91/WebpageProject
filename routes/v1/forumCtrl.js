const path = require('path');

const { Forum } = require(path.join(__dirname, '../../models'));
const { getMemberAuth } = require('./memberCtrl');

/* #region Create */
async function createForum(req, res, next) {
    try {
        // TODO: 게시판 생성 권한 처리를 어떻게 해야할까????
        const forum = new Forum({
            forumTitle: req.body.forumTitle,
        });
        
        await forum.save();
        return res.json({ results: forum });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Read */
async function getOneForumData(req, res, next) {
    try {
        const retData = await Forum.findOne({ where: {forumId: req.body.forumId}, raw: true});
        return res.json({ results: retData });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

async function getAllForumData(req, res, next) {
    try {
        const retData = await Forum.findAll({ raw: true });
        return res.json({ results: retData });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

async function getForumAuth(_forumId){
    try {
        const forumAuth = await Forum.findOne({ where: {forumId: _forumId}, attributes: ['forumAuth'], raw: true });
        return forumAuth.forumAuth;
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Update */
async function modifyForum(req, res, next) {
    try {
        Forum.findOne({ where: {forumId: req.body.forumId} }).then(async (forum) => {
            if (!forum) {    // check valid data
                throw "Forum is not exist!";
            } else if (forum.forumTitle === req.body.forumTitle) {
                throw "Data doesn't changed";
            }
            
            await Forum.update({
                forumTitle: req.body.forumTitle,
            }, { where: { forumId: req.body.forumId }
            });
        }).catch((err) => {
            console.log(err);
            return res.status(501).json({
                code: 501,
                message: err,
            });
        });

        return res.status(200).json({
            code: 200,
            message: "success!!",
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}
/* #endregion */


/* #region Delete */
async function deleteForum(req, res, next) {
    try {
        // 지울수 있는 권한 체크 필요
        await Forum.destory({ where: {forumId: req.body.forumId} });
        /*
        Forum.findOne({ where: {forumId: req.body.forumId} }).then(async (forum) => {
            
        });*/
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
}
/* #endregion */


module.exports = {
    createForum,
    getOneForumData,
    getAllForumData,
    getForumAuth,
    modifyForum,
    deleteForum
}