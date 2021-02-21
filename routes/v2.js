const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const cors = require('cors');

const memberCtrl = require('./v2/memberCtrl');
const postCtrl = require('./v2/postCtrl');
const forumCtrl = require('./v2/forumCtrl');
const commentCtrl = require('./v2/commentCtrl');

const router = express.Router();

// Access-Control-Allow-Origin
router.use(cors());


// check upload folder for image
fs.readdir('uploads', (error) => {
    if (error) {
        console.error('There are not exist uploads folder. Create uploads folder');
        fs.mkdirSync('uploads');
    }
});

const uploadNothing = multer();
const uploadFile = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});



// Member Controller
router.post('/auth/join', isNotLoggedIn, (req, res, next) => memberCtrl.join(req, res, next));
router.post('/auth/login', isNotLoggedIn, (req, res, next) => memberCtrl.login(req, res, next));
router.get('/auth/logout', isLoggedIn, (req, res, next) => memberCtrl.logout(req, res, next));
router.post('/auth/isRegistered', isNotLoggedIn, (req, res, next) => memberCtrl.isRegistered(req, res, next));


// Forum Controller
router.post('/createForum', isLoggedIn, (req, res, next) => forumCtrl.createForum(req, res, next));
router.get('/getOneForumData', isLoggedIn, (req, res, next) => forumCtrl.getOneForumData(req, res, next));
router.get('/getAllForumData', isLoggedIn, (req, res, next) => forumCtrl.getAllForumData(req, res, next));
router.put('/modifyForum', isLoggedIn, (req, res, next) => forumCtrl.modifyForum(req, res, next));
router.delete('/deleteForum', isLoggedIn, (req, res, next) => forumCtrl.deleteForum(req, res, next));


// Post Controller
router.post('/uploadImg', isLoggedIn, uploadFile.array('imgLink', 10), (req, res) => postCtrl.uploadImg(req, res));
router.post('/uploadPost', isLoggedIn, uploadNothing.none(), (req, res, next) => postCtrl.uploadPost(req, res, next));
router.get('/getPostContentsData', isLoggedIn, (req, res, next) => postCtrl.getPostContentsData(req, res, next));
router.get('/getPostsDataByForumId', isLoggedIn, (req, res, next) => postCtrl.getPostsDataByForumId(req, res,next));
router.put('/modifyPost', isLoggedIn, (req, res, next) => postCtrl.modifyPost(req, res, next));
router.delete('/deletePost', isLoggedIn, (req, res, next) => postCtrl.deletePost(req, res, next));
router.put('/postRecommend', isLoggedIn, (req, res, next) => postCtrl.postRecommend(req, res, next));


// Comment Controller
router.post('/createComment', isLoggedIn, (req, res, next) => commentCtrl.createComment(req, res, next));
router.put('/modifyComment', isLoggedIn, (req, res, next) => commentCtrl.modifyComment(req, res, next));
router.delete('/deleteComment', isLoggedIn, (req, res, next) => commentCtrl.deleteComment(req, res, next));
// TODO: Post를 return 할 때 get comment를 제공함. 이를 따로 제공할지 전략을 구상해야 함.


module.exports = router;