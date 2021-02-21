const path = require('path');

const { Comment } = require(path.join(__dirname, '../../models'));
const { getMemberAuth } = require('./memberCtrl');
const { getForumAuth } = require('./forumCtrl');

/* #region Create */
async function createComment(req, res, next) {
    try {
        if (await getMemberAuth(req.user) < await getForumAuth(req.body.forumId)) { // 권한 확인
            throw "You don't have permission to comment this forum";
        }

        const comment = await Comment.create({
            contents: req.body.contents,
            memId: req.user.memId,
            forumId: req.body.forumId
        });

        // TODO: 해당 포스트 url을 return

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Read */
async function getCommentsData(_postId) {
    try {
        const comments = Comment.findAll({ where: {postId: _postId}, raw: true,
            attributes: ['contents']
        });
        return comments;
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */

/* #region Update */
async function modifyComment(req, res, next) {
    try {
        Comment.findOne({ where: {commentId: req.body.commentId} }).then(async (comment) => {
            if (!comment) {    // check valid data
                throw "Comment is not exist!";
            } else if (comment.memId !== req.user.memId) {
                throw "Comment owner doesn't match!";
            } else if (comment.contents === req.body.contents) {
                throw "Data doesn't changed";
            }
            
            await Comment.update({
                contents: req.body.contents
            }, { where: { commentId: req.body.commentId }
            }, {transaction: true});
        }).catch((err) => {
            console.log(err);
            return res.status(501).json({
                code: 501, // TODO: 각종 에러코드 정리 및 관리 방법 고안
                message: err,
            });
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Delete */
async function deleteComment(req, res, next) {
    try {
        Comment.findOne({ where: {commentId: req.body.commentId} }).then(async (comment) => {
            if (comment.memId != req.user.memId) {
                throw "Error! You are not post owner.";
            }
            await Comment.destroy({ where: {commentId: req.body.commentId} });
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


module.exports = {
    createComment,
    getCommentsData,
    modifyComment,
    deleteComment
}