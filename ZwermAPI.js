'use strict';

/** @type {AxiosStatic} */
const axios = require('axios').default;
const qs = require('qs');

/**
 *
 */
class ZwermAPI {

    /**
     *
     * @param {?string} apiUrl
     * @param {?string} apiToken
     */
    constructor(apiUrl, apiToken) {
        /**
         *
         * @type {!string}
         * @private
         */
        this._apiUrl = apiUrl;
        /**
         *
         * @type {?string}
         * @private
         */
        this._apiToken = apiToken;
    }

    // region getters & setters
    /**
     * @return {Zwerm.DISABLED_ROUTING}
     * @static
     */
    static get DISABLED_ROUTING() {
        return '/dev/null';
    }

    /**
     * @return {Zwerm.ROUTE_DELIMITER}
     * @static
     */
    static get ROUTE_DELIMITER() {
        return '/';
    }

    // region apiUrl (get & set)
    /**
     *
     * @return {!string}
     */
    get apiUrl() {
        return this._apiUrl;
    }

    /**
     *
     * @param {!string} apiUrl
     */
    set apiUrl(apiUrl) {
        this._apiUrl = apiUrl;
    }

    // endregion
    // region apiToken (get & set)
    /**
     *
     * @return {?string}
     */
    get apiToken() {
        return this._apiToken;
    }

    /**
     *
     * @param {?string} apiToken
     */
    set apiToken(apiToken) {
        this._apiToken = apiToken;
    }

    // endregion
    /**
     *
     * @return {AxiosInstance}
     * @private
     */
    get _zwermRequest() {
        return axios.create({
            baseURL: this._apiUrl,
            headers: {
                Authorization: `Bearer ${this._apiToken}`,
                'X-Clacks-Overhead': 'GNU Terry Pratchett'
            }
        });
    }

    // endregion
    // region configuration
    /**
     *
     * @param {string} apiUrl
     * @param {string} apiToken
     *
     * @return {ZwermAPI}
     */
    use({ apiUrl = this.apiUrl, apiToken = this.apiToken } = {}) {
        this.apiUrl = apiUrl;
        this.apiToken = apiToken;

        return this;
    }

    /**
     * Sets the api url in a chain-able manner
     *
     * @param {string} apiUrl
     *
     * @return {ZwermAPI}
     */
    useUrl(apiUrl) {
        this.apiUrl = apiUrl;

        return this;
    }

    /**
     * Sets the api token in a chain-able manner
     *
     * @param {string} apiToken
     *
     * @return {ZwermAPI}
     */
    useToken(apiToken) {
        this.apiToken = apiToken;

        return this;
    }

    //endregion
    // region bots
    // region bot users
    /**
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<Zwerm.Database.EvaluatedUserKeys, Zwerm.Database.UserEntry>>}
     */
    listBotUsers(teamSlug, botId, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users`, { params: { limit, sort } })
                   .then(response => response.data);
    }

    /**
     * Filter users of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {Zwerm.API.DynamoFilter<Zwerm.Database.UserEntry>} filterObj
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<Zwerm.Database.EvaluatedUserKeys, Zwerm.Database.UserEntry>>}
     */
    filterBotUsers(teamSlug, botId, filterObj, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.post(`bots/${teamSlug}/${botId}/users/filter`, filterObj, { params: { limit, sort } })
                   .then(response => response.data);
    }

    /**
     * Get a single user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<Zwerm.Database.UserEntry>}
     */
    getBotUser(teamSlug, botId, userId) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}`)
                   .then(response => response.data['Item']);
    }

    /**
     * Get the markup for the a user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<Zwerm.Database.UserMarkup>}
     */
    getBotUserMarkup(teamSlug, botId, userId) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/markup`)
                   .then(response => response.data);
    }

    /**
     * Update the markup for the a user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<Zwerm.Database.UserMarkup>}
     */
    updateBotUserMarkup(teamSlug, botId, userId) {
        return this._zwermRequest.put(`bots/${teamSlug}/${botId}/users/${userId}/markup`)
                   .then(response => response.data);
    }

    /**
     * Get the markup for the a user of a bot. Force update if no data is returned.
     * We recommend this method as the most efficient way to retrieve user markup data unless the most up to data is needed.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<Zwerm.Database.UserMarkup>}
     */
    getOrUpdateBotUserMarkup(teamSlug, botId, userId) {
        return this.getBotUserMarkup(teamSlug, botId, userId)
                   .then(markup => {
                       if (!markup || Object.keys(markup).length === 0) {
                           return this.updateBotUserMarkup(teamSlug, botId, userId);
                       }
                       return markup;
                   });
    }

    // endregion
    // region bot conversations
    /**
     * Filters conversations of a specific user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {Zwerm.API.DynamoFilter<Zwerm.Database.ConversationEntry>} filterObj
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<null, Zwerm.Database.ConversationEntry>>}
     */
    filterBotUserConversations(teamSlug, botId, userId, filterObj, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.post(`bots/${teamSlug}/${botId}/users/${userId}/conversations/filter`, filterObj, { params: { limit, sort } })
                   .then(response => response.data);
    }

    /**
     * Lists conversations of a specific bot user.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<null, Zwerm.Database.TransactionEntry>>}
     */
    listBotUserConversations(teamSlug, botId, userId, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/conversations`, { params: { limit, sort } })
                   .then(response => response.data);
    }

    /**
     * Get a single conversation of a user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {string} conversationId
     *
     * @return {Promise<Zwerm.Database.ConversationEntry>}
     */
    getBotUserConversation(teamSlug, botId, userId, conversationId) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/conversations/${conversationId}`)
                   .then(response => response.data['Item']);
    }

    // endregion
    // region bot transactions
    /**
     * Filters transactions of a specific user of a bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {Zwerm.API.DynamoFilter<Zwerm.Database.TransactionEntry>} filterObj
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<Zwerm.Database.EvaluatedTransactionKeys, Zwerm.Database.TransactionEntry>>}
     */
    filterBotUserTransactions(teamSlug, botId, userId, filterObj, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.post(`bots/${teamSlug}/${botId}/users/${userId}/transactions/filter`, filterObj, { params: { limit, sort } })
                   .then(response => response.data);
    }

    /**
     * Lists transactions of a specific bot user.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {?number} [limit]
     * @param {Zwerm.API.SortOrder} [sort='desc']
     *
     * @return {Promise<Zwerm.API.DynamoResult<Zwerm.Database.EvaluatedTransactionKeys, Zwerm.Database.TransactionEntry>>}
     */
    listBotUserTransactions(teamSlug, botId, userId, { limit, sort = 'desc' } = {}) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/transactions`, { params: { limit, sort } })
                   .then(response => response.data);
    }

    // endregion
    // region list bots
    /**
     * List your bots.
     *
     * @return {Promise<{ bots: Array<Zwerm.API.BotInfo> }>}
     */
    listUserBots() {
        return this._zwermRequest.get('/user/bots')
                   .then(response => response.data);
    }

    /**
     * List your bots.
     *
     * @param {string} teamSlug
     *
     * @return {Promise<Zwerm.API.Team>}
     */
    listTeamBots(teamSlug) {
        return this._zwermRequest.get(`/teams/${teamSlug}/bots`)
                   .then(response => response.data);
    }

    // todo: createBot(botDetails)
    /**
     * @param {string} teamSlug
     * @param {string} botId
     *
     * @return {Promise<Zwerm.API.BotInfo>}
     */
    getSingleBot(teamSlug, botId) {
        return this._zwermRequest.get(`/bots/${teamSlug}/${botId}`)
                   .then(response => response.data);
    }

    /**
     *
     * @return {Promise<{ bots: Array<Zwerm.API.BotInfo>, config: BotsSchema.Bots }>}
     */
    listAllBots() {
        return this._zwermRequest.get('/bots')
                   .then(response => response.data);
    }

    // endregion
    // endregion
    // region bot routing
    // region user routing
    /**
     * Gets the current route of the given user for the given bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<string>}
     */
    getCurrentRouteForUser(teamSlug, botId, userId) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/route`)
                   .then(response => response.data['route']);
    }

    /**
     * Puts the given route as the current route of the given user for the given bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {string} route
     *
     * @return {Promise<string>}
     */
    putCurrentRouteForUser(teamSlug, botId, userId, route) {
        return this._zwermRequest.put(`bots/${teamSlug}/${botId}/users/${userId}/route`, { route })
                   .then(response => response.data['route']);
    }

    /**
     * Deletes the current route of the given user for the given bot.
     *
     * This will restore the routing back to it's original, default value.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     *
     * @return {Promise<string>}
     */
    deleteCurrentRouteForUser(teamSlug, botId, userId) {
        return this._zwermRequest.delete(`bots/${teamSlug}/${botId}/users/${userId}/route`)
                   .then(response => response.data);
    }

    // endregion
    // region conversation routing
    /**
     * Gets the current route of the given conversation for the given user of the given bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {string} conversationId
     *
     * @return {Promise<string>}
     */
    getCurrentRouteForConversation(teamSlug, botId, userId, conversationId) {
        return this._zwermRequest.get(`bots/${teamSlug}/${botId}/users/${userId}/conversations/${conversationId}/route`)
                   .then(response => response.data['route']);
    }

    /**
     * Puts the given route as the current route of the given conversation for the given user for the given bot.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {string} conversationId
     * @param {string} route
     *
     * @return {Promise<string>}
     */
    putCurrentRouteForCoversation(teamSlug, botId, userId, conversationId, route) {
        return this._zwermRequest.put(`bots/${teamSlug}/${botId}/users/${userId}/conversations/${conversationId}/route`, { route })
                   .then(response => response.data['route']);
    }

    /**
     * Deletes the current route of the given conversation for the given user for the given bot.
     *
     * This will restore the routing back to it's original, default value.
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {string} userId
     * @param {string} conversationId
     *
     * @return {Promise<string>}
     */
    deleteCurrentRouteForCoversation(teamSlug, botId, userId, conversationId) {
        return this._zwermRequest.delete(`bots/${teamSlug}/${botId}/users/${userId}/conversations/${conversationId}/route`)
                   .then(response => response.data);
    }

    // endregion
    // endregion
    // region metrics
    /**
     * Request a set of metrics for a bot.
     *
     * @example <caption>Request the same metric multiple times with different configurations.</caption>
     * zwerm.getBotMetrics('my-team', 'my-bot',
     *     {activeUsers: {interval: '1d', start: '2018-04-01T00:00:00.000Z', end: '2018-05-01T00:00:00.000Z'}},
     *     {activeUsers: {start: '2018-04-01T00:00:00.000Z', end: '2018-04-02T00:00:00.000Z'}}
     * ).then(console.log);
     *
     * @param {string} teamSlug
     * @param {string} botId
     * @param {Object<string, Object<string, string>>} [metrics=[]]
     *
     * @return {Promise<AxiosResponse<Object>>}
     */
    getBotMetrics(teamSlug, botId, ...metrics) {
        let index = 0;
        const keys = {};
        const options = {};

        // For all requested metric objects
        metrics.forEach(metric => {
            // go through all keys (they can have more than one, event though it is not recommended)
            Object.keys(metric).forEach(key => {
                // store the metric key name with the matching index
                keys[index] = key;

                // go through all the options
                Object.keys(metric[key]).forEach(option => {
                    // store the option with the matching index
                    options[option] = options[option] || {};
                    options[option][index] = metric[key][option];
                });

                // up the index for the next round.
                index++;
            });
        });

        return this._zwermRequest
                   .get(`metrics/${teamSlug}/${botId}`, {
                       params: Object.assign(options, { metrics: keys }),
                       // we need to use a serializer that converts the objects to arrays, instead of encoding them
                       paramsSerializer: params => qs.stringify(params, { encode: false })
                   })
                   .then(response => response.data);
    }

    // endregion
    // region teams
    /**
     * List your teams
     *
     * @return {Promise<Zwerm.API.Team>}
     */
    listUserTeams() {
        return this._zwermRequest.get('/user/teams')
                   .then(response => response.data);
    }

    // endregion
    // region authenticated user
    /**
     * Get the authenticated user.
     *
     * @return {Promise<Zwerm.API.User>}
     */
    getUser() {
        return this._zwermRequest.get('/user')
                   .then(response => response.data);
    }

    /**
     * Update the authenticated user.
     *
     * @param {Zwerm.API.PartialUser} partialUser
     *
     * @return {Promise<Zwerm.API.User>}
     */
    updateUser(partialUser) {
        return this._zwermRequest.patch('/user', partialUser)
                   .then(response => response.data);
    }

    // endregion
}

module.exports = ZwermAPI;
