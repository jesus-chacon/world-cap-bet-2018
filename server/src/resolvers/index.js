const {Query} = require('./Query');
const Mutations = require('./Mutation');
const {AuthPayload} = require('./AuthPayload');

module.exports = {
    Query,
    Mutation: {
        ...Mutations
    },
    AuthPayload,
};