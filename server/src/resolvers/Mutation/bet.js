const _ = require('lodash');
const Q = require('q');

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

        bet = {id: createBet.id};
    }

    return bet;
}

async function checkListOfCountries(ctx, countries, length) {
    _.remove(countries, country => !country || country.trim().length == 0);
    countries = _.uniq(countries);

    if (countries.length != length) throw new Error(`The countries selected are invalid ${length} ${countries.length}`);

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

async function prepareRound(ctx, countries, roundName, totalCountries) {
    await checkListOfCountries(ctx, countries, totalCountries);

    const list = await createCountriesList(ctx, countries, roundName);

    return {connect: list};
}

async function prepareGroups(ctx, groups) {
    if (groups.length != 8) throw new Error('The number of groups is wrong');

    let selection = [];
    _.forEach(groups, group => {selection = _.concat(selection, group)});

    return prepareRound(ctx, selection, 'Groups', 32);
}

const bet = {
    async addInfoToBet(parent, args, ctx, info) {
        const {groups, round8, round4, round2, final} = args;
        const bet = await ensureBet(ctx);
        let data = {};

        if (!!groups) {
            data.groups = await prepareGroups(ctx, groups);
        }

        if (!!round8) {
            data.round8 = await prepareRound(ctx, round8, 'Round 8', 16);
        }

        if (!!round4) {
            data.round4 = await prepareRound(ctx, round4, 'Round 4', 8);
        }

        if (!!round2) {
            data.round2 = await prepareRound(ctx, round2, 'Round 2', 4);
        }

        if (!!final) {
            data.final = await prepareRound(ctx, final, 'Final', 2);
        }

        return ctx.db.mutation.updateBet({
            where: bet,
            data
        }, info);
    }
};

module.exports = bet;