const local = require('./localStrategy');
const { Member } = require('../models');

module.exports = (passport) => {
    passport.serializeUser((member, done) => {
        done(null, member.memId);
    });

    passport.deserializeUser((memId, done) => {
        Member.findOne({ where: { memId: memId } })
            .then(member => done(null, member))
            .catch(err => done(err));
    });

    local(passport);
}