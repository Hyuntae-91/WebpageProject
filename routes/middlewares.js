exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('Please Login');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
};

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: 'A new Version exists. Please use the new Version.',
    });
};