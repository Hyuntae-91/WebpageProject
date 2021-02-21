const passport = require('passport');
const bcrypt = require('bcrypt');
const path = require('path');

const { Member } = require(path.join(__dirname, '../../models'));

async function isRegistered(req, res, next) {
    const exMember = await Member.findOne({where: { memUserId: req.body.memUserId }, raw: true}); 
    if (exMember !== null) {
        return false;
    } else {
        return true;
    }
}

async function join(req, res, next) {
    try {
        const hash = await bcrypt.hash(req.body.password, 12);
        const member = new Member({
            memUserId: req.body.memUserId,
            memEmail: req.body.memEmail,
            name: req.body.name,
            nick: req.body.nick,
            password: hash,
            sex: req.body.sex,
            address: req.body.address,
            phone: req.body.phone,
            memAuth: 0
        });
        await member.save();
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
};

async function login(req, res, next) {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            return res.status(401).send(info.message);
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        }); 
    })(req, res, next);
};

async function logout(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
};


async function getMemberAuth(_id) {
    try {
        const memberAuth = await Member.findOne({ where: {memId: _id}, attributes: ['memAuth'], raw: true });
        return memberAuth.memAuth;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function checkMemberAuth(_id, memberAuth) {
    try {
        if (await getMemberAuth(_id) >= memberAuth) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = {
    join,
    login,
    logout,
    getMemberAuth,
    checkMemberAuth,
    isRegistered
};