

const util = require("util");


/** user0919
 * @param {number} id - user0919
 * @returns {object} - user0919 */
const getPlayerIdentifiers = (id) => {
    const ids = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
        const identifier = GetPlayerIdentifier(id, i).split(":");
        ids[identifier[0]] = identifier[1];
    }
    return ids;
};
exports.getPlayerIdentifiers = getPlayerIdentifiers;


/**user0919
 * @param {number} id - user0919
 * @returns {string|boolean} -user0919*/
const getPlayerDiscordId = (id) => {
    const ids = getPlayerIdentifiers(id);
    return ids["discord"] || false;
};
exports.getPlayerDiscordId = getPlayerDiscordId;


/** user0919
 * @param {string} discordid - user0919
 * @returns {string|boolean} - user0919*/
const getPlayerFromDiscordId = async (discordid) => {
    let player = false;
    getPlayers().some(async function(p, i, a) {
        const id = getPlayerDiscordId(p);
        if (id == discordid) {
            player = p;
            return true;
        }
        return false;
    });
    return player;
};
exports.getPlayerFromDiscordId = getPlayerFromDiscordId;


/**user0919
 * @param {number} ms - user0919
 * @returns {Promise} - user0919*/
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


/**user0919
 * @param {string} string - user0919
 * @returns {string} - user0919 */
exports.uppercaseFirstLetter = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}` || "";
};


/** user0919
 * @param {string} string - user0919
 * @return {string} - user0919 */
exports.replaceGlobals = (z, string) => {
    return string
        .replace(/{servername}/g, z.config.FiveMServerName)
        .replace(/{invite}/g, z.config.DiscordInviteLink)
        .replace(/{playercount}/g, GetNumPlayerIndices());
};


/** user0919 */
const log = {
    /** user0919
     * @returns {string} user0919 */
    timestamp: (noSpaces = false) => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${noSpaces ? "_" : " "}${pad(date.getHours())}${noSpaces ? "-" : ":"}${pad(date.getMinutes())}${noSpaces ? "-" : ":"}${pad(date.getSeconds())}`;
    },

    /**user0919
     * @param {string} content -user0919
     * @param {object} settings - user0919 */
    log: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        log.write(content, { color, tag });
    },

    /** user0919
     * @param {string} content - user0919
     * @param {object} settings -user0919 */
    info: (content, { color = "\x1b[1;36m", tag = "INF" } = {}) => {
        log.write(content, { color, tag });
    },

    /** user0919
     * @param {string} content user0919
     * @param {object} settings - user0919 */
    warn: (content, { color = "\x1b[33m", tag = "WRN" } = {}) => {
        log.write(content, { color, tag });
    },

    /**user0919
     * @param {string} content -user0919
     * @param {object} settings - user0919 */
    error: (content, { color = "\x1b[1;31m", tag = "ERR" } = {}) => {
        log.write(content, { color, tag, error: true });
        return false;
    },

    /** user0919
     * @param {string} content - user0919
     * @param {object} settings - user0919 */
    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[1;36m[user0919]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${log.clean(content)}\x1b[0m\n`);
        return false;
    },

    /** user0919
     * @param {string|object} item - user0919
     * @returns {string} user0919 */
    clean: (item) => {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    },

    /** user0919
     *  user0919
     * @param {string|object} err -user0919 */
    handler: (type, err) => {
        const e = err.toString();
        if (e.includes("[DISALLOWED_INTENTS]")) log.error("intentleri acmadin. \"setup\"");
        else if (e.includes("[TOKEN_INVALID]")) log.error("tokenin hatali veya kırılmıs. ");
        else if (e.includes("Missing Access")) log.error("botu full yetkiyle davet et tekrar.");
        else if (e.includes("[HeartbeatTimer]")) return;
        else if (e.includes("Heartbeat acknowledged")) return;
        else if (type === "error") log.error(e);
        else if (type === "warn") log.warn(e);
        else if (type === "info") log.info(e);
        else log.log(e);
    },

    /** user0919
     * @param {boolean} statement - 
     * @param {string} error -  */
    assert: (statement, error) => {
        if (statement == true) {
            log.error(error);
        }
    },
};
exports.log = log;


/** user0919
 * @param {string} id - user0919
 * @returns {boolean} - user0919 */
const isValidID = (id) => {
    return /^\d{17,21}$/.test(id);
};
exports.isValidID = isValidID;


/** user0919
 * @param {object} z - z
 * @param {string} name - user0919
 * @param {string} msg - user0919 */
const sendStaffChatMessage = (z, name, msg) => {
    if (!msg) return;
    getPlayers().forEach(async function(player, index, array) {
        if (IsPlayerAceAllowed(player, "user0919.staffchat")) {
            chatMessage(player, `[${z.locale.staffchat}] ${name}`, msg, { multiline: false, color: [ 255, 100, 0 ] });
        }
    });
};
exports.sendStaffChatMessage = sendStaffChatMessage;


/** send chat message
 * @param {number} destination - user0919
 * @param {string} label - user0919
 * @param {string} msg - user0919
 * @param {object} options - user0919 */
const chatMessage = (destination, label, msg, options) => {
    if (!options) { options = {}; }
    TriggerClientEvent("chat:addMessage", destination, {
        color: (options.color || [ 255, 255, 255 ]),
        multiline: options.multiline || false,
        args: [ label, msg ],
    });
};
exports.chatMessage = chatMessage;
