const Router = require('express').Router;
const router = Router();
const User = require('../models/User');
const ensureAuth = require('../auth/ensure-auth')();
const { sign } = require('../auth/token-service');

function hasEmailPassword(req, res, next) {
    const user = req.body;
    if(!user || !user.email || !user.password ) {
        return next({
            code: 400,
            error: 'email and password required'
        });
    }
    next();
}

router
    .get('/verify', ensureAuth, (req, res) => {
        res.send({ valid: true });  
    }) 

    .post('/signup', hasEmailPassword, (req, res, next) => {
        const { name, email, password } = req.body;
        delete req.body.password;

        User.exists({ email })
            .then(exists => {
                if (exists) { throw { code: 400, error: 'email in use' }; }
                const user = new User({ name, email });
                user.generateHash(password);
                return user.save();
            })
            .then(user => Promise.all([user, sign(user)]))
            .then(([user, token]) => res.send({
                token,
                name: user.name,
                email: user.email,
            }))
            .catch(next);
    })

    .post('/signin', hasEmailPassword, (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw { code: 401, error: 'Invalid Login' };
                }
                return user;
            })
            .then(user => Promise.all([user, sign(user)]))
            .then(([user, token]) => res.send({
                token,
                name: user.name,
                email: user.email,
                
            }))
            .catch(next);
    });

module.exports = router;