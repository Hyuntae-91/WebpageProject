const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { Member } = require('../models');

module.exports = (passport) => {
    passport.use(new LocalStrategy({
        usernameField:'memUserId',
        passwordField:'password',
    }, async (memUserId, password, done) => {
        try {
            const exMember = await Member.findOne({ where: { memUserId: memUserId } });
            if (exMember) {
                const result = await bcrypt.compare(password, exMember.password);
                if (result) {
                    done(null, exMember);
                } else {
                    done(null, false, { message: 'Password is incorrect' });
                }
            } else {
                done(null, false, { message : 'ID is not exist' });
            }
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};