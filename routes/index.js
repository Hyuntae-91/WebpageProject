const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

// Home Page
router.get('/', async (req, res, next) => {
    try {
        if (!req.user) {
            return res.render('login', { title: '로그인', member: req.user, loginError: req.flash('loginError') });
        }

        return res.render('main', {
            title:'Main',
            member: req.user,
            loginError: req.flash('loginError')
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}); 

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: 'Register Member',
        member: req.user,
        joinError: req.flash('joinError'),
    });
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile', { title: 'My info', member: req.user });
});

router.get('/admin', isLoggedIn, (req, res) => {
    res.render('admin', { title: 'admin', member: req.user });
})


module.exports = router;