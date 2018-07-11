const _ = require('lodash');
const Q = require('q');
const Moment = require('moment');

const {getUserId} = require('../../utils');

const bet = {
    async addGroupsToBet(parent, args, ctx, info) {
        const {groups} = args;
        const userId = getUserId(ctx);

        let {bet} = (await ctx.db.query.users({where: {id: userId}}, '{bet { id }}'))[0];

        if (!bet) {
            const createBet = await ctx.db.mutation.createBet({data: {}}, '{id}');

            await ctx.db.mutation.updateUser({
                where: {id: userId},
                data: {bet: {connect: createBet}}
            }, '{id}');

            bet = createBet.id;
        }

        throw new Error();

        if (groups.length != 8) throw new Error('The number of groups is wrong');

        let selection = [];

        _.forEach(groups, group => {selection = _.concat(selection, group)});
        _.remove(selection, country => !country || country.trim().length == 0);
        selection = _.uniq(selection);

        if (selection.length != 32) throw new Error('The groups selected are invalid');

        let checks = await Q.all(_.map(selection, countryId => ctx.db.exists.Country({id: countryId})));
        let noValid = _.remove(checks, check => !check);

        if (noValid.length > 0) throw new Error("The countries selected are invalid");

        return ctx.db.mutation.createBet({
            data: {
                created
            }
        })
    }
};

module.exports = bet;