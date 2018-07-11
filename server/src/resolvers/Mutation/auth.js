const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = {
    async signup(parent, args, ctx, info) {
        const {name, email, password} = args;

        if (!name) throw new Error('Name is required');
        if (!email) throw new Error('Email is required');
        if (!password) throw new Error('Password is required');

        const checkUser = await ctx.db.query.user({where: {email}});
        if (!!checkUser) throw new Error('The email is in use');

        const safePassword = await bcrypt.hash(password, 10)

        const user = await ctx.db.mutation.createUser({
            data: {name, email, password: safePassword},
        });

        return {
            token: jwt.sign({userId: user.id}, process.env.APP_SECRET),
            user,
        }
    },

    async login(parent, {email, password}, ctx, info) {
        const user = await ctx.db.query.user({where: {email}})
        if (!user) {
            throw new Error(`No such user found for email: ${email}`)
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
            throw new Error('Invalid password')
        }

        return {
            token: jwt.sign({userId: user.id}, process.env.APP_SECRET),
            user,
        }
    },
};

module.exports = auth;