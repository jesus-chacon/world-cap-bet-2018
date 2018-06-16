const {getUserId} = require('../utils')

const Query = {
    me(parent, args, ctx, info) {
        const id = getUserId(ctx)
        return ctx.db.query.user({where: {id}}, info);
    },
    players(parent, {search}, ctx, info) {
        return ctx.db.query.players({where: {name_contains: search}}, info)
    },
    countries(parent, {search}, ctx, info) {
        return ctx.db.query.countries({where: {name_contains: search}}, info)
    }
}

module.exports = {Query};