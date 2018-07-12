const _ = require('lodash');
const Q = require('q');
const Moment = require('moment');

const {getUserId} = require('../../utils');

async function ensureBet(ctx) {
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

    return bet;
}

async function checkListOfCountries(ctx, countries, length) {
    _.remove(countries, country => !country || country.trim().length == 0);
    countries = _.uniq(countries);

    if (countries.length != length) throw new Error('The groups selected are invalid');

    let checks = await Q.all(_.map(countries, id => ctx.db.exists.Country({id})));
    let noValid = _.remove(checks, check => !check);

    if (noValid.length > 0) throw new Error("The countries selected are invalid");
}

function createCountriesList(ctx, ids, name) {
    let data = {
        name,
        countries: {
            connect: _.map(ids, id => ({id}))
        }
    };

    return ctx.db.mutation.createCountriesList({data}, '{id}');
}

const bet = {
    async addGroupsToBet(parent, args, ctx, info) {
        const {groups} = args;
        const bet = await ensureBet(ctx);

        if (groups.length != 8) throw new Error('The number of groups is wrong');

        let selection = [];
        _.forEach(groups, group => {selection = _.concat(selection, group)});

        await checkListOfCountries(ctx, selection, 32);

        let list = await createCountriesList(ctx, selection, 'groups');

        return ctx.db.mutation.updateBet({
            where: bet,
            data: {
                groups: {connect: list}
            }
        }, info);
    }
};

module.exports = bet;