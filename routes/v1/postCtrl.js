const path = require('path');

const { Post, PostRecommend } = require(path.join(__dirname, '../../models'));
const { getMemberAuth } = require('./memberCtrl');
const { getForumAuth } = require('./forumCtrl');
const { getCommentsData } = require('./commentCtrl');

/* #region Create */
function uploadImg(req, res) {
    // TODO: 여러개 파일을 동시에 올릴 경우 처리 필요.
    console.log(req.files);
    res.json({ url: `/img/${req.files[0].filename}` });
};


async function uploadPost(req, res, next) {
    try {
        /*
        if (await getMemberAuth(req.user) < await getForumAuth(req.body.forumId)) {
            throw "You don't have permission to post this forum";
        }
        */
        // TODO: forum 존재 여부 체크 필요
        // TODO: postTitle과 contents 내용이 없으면 error 처리
        const post = await Post.create({
            postTitle: req.body.postTitle,
            contents: req.body.contents,
            imgLink: req.body.url,
            memId: req.user.memId,
            forumId: req.body.forumId
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Read */
async function getPostsDataByForumId(req, res, next) {
    try {
        const postsData = await Post.findAll({ where: { forumId: req.body.forumId }, raw: true });
        return res.json({ results: postsData });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}

async function getPostContentsData(req, res, next) {
    try {
        // TODO: 각각 query하는 방식을 Join하여 처리하는 방식으로 변경하면 좋을듯
        const post = await Post.findOne({ where: {postId: req.body.postId}, raw: true });
        const recommendData = await PostRecommend.findAll({ where: {postId: req.body.postId}, raw: true }).then((recommends) => {
            let retData = new Object();
            retData.likes = 0;
            retData.dislikes = 0;
            for (let value of recommends) {
                retData.likes += value.like;
                retData.dislikes += value.dislike;
            }
            return retData;
        });
        const commentData = await getCommentsData(req.body.postId);

        post.like = recommendData.like;
        post.dislike = recommendData.dislike;
        post.comments = commentData;

        return res.json({ results: post });
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


/* #region Update */
async function modifyPost(req, res, next) {
    try {
        Post.findOne({ where: {postId: req.body.postId} }).then(async (post) => {
            if (!post) {    // check valid data
                throw "Post is not exist!";
            } else if (post.memId !== req.user.memId) {
                throw "Post owner doesn't match!";
            } else if (post.postTitle === req.body.postTitle && post.contents === req.body.contents) {
                throw "Data doesn't changed";
            }
            
            await Post.update({
                postTitle: req.body.postTitle,
                contents: req.body.contents
            }, { where: { postId: req.body.postId }
            }, {transaction: true});
        }).catch((err) => {
            console.log(err);
            return res.status(501).json({
                code: 501,
                message: err,
            });
        });

        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

async function postRecommend(req, res, next) { 
    try {
        Post.findOne({ where: {postId: req.body.postId} }).then(async (post) => {
            if (post.memId == req.body.memId) {
                throw "You can't recommend your post by yourself!";
            }

            PostRecommend.findOne({ where: {postId: req.body.postId, memId: req.body.memId} }).then(async (recommend) => {
                if (recommend) {
                    TimeNow = new Date();                
                    if ((TimeNow - recommend.clickedTime) / (60 * 60 * 1000) <= 24 ) {
                        throw "You can recommend once a day at same Post";
                    } else if (req.body.like > 1 || req.body.dislike > 1) { // like나 dislike 숫자 임의 조정 예외처리
                        throw "Wrong input Error!";
                    } else {
                        await PostRecommend.update({
                            like: recommend.like + req.body.like,
                            dislike: recommend.dislike + req.body.dislike,
                            clickedTime: TimeNow
                        }, {where: {postId: req.body.postId, memId: req.body.memId} 
                        }, {transaction: true});
                    }                
                } else {
                    await new PostRecommend({
                        likedIp: null,
                        like: req.body.like,
                        dislike: req.body.dislike,
                        memId: req.body.memId,
                        postId: req.body.postId,
                    }).save();
                }
    
                return res.status(200).json({
                    code: 200,
                    message: "success!!",
                });
            })
        }).catch((err) => {
            console.log(err);
            return res.status(502).json({
                code: 502,
                message: err,
            });
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
}
/* #endregion */


/* #region Delete */
async function deletePost(req, res, next) {
    try {
        Post.findOne({ where: {postId: req.body.postId} }).then(async (post) => {
            if (post.memId != req.user.memId) {
                throw "Error! You are not post owner.";
            }
            await Post.destroy({ where: {postId: req.body.postId} });
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};
/* #endregion */


module.exports = {
    uploadImg,
    uploadPost,
    getPostContentsData,
    getPostsDataByForumId,
    modifyPost,
    deletePost,
    postRecommend,
}