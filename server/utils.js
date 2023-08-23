

const util = require("util");


/** xayibogantr
 * @param {number} id - xayibogantr
 * @returns {object} - xayibogantr */
const getPlayerIdentifiers = (id) => {
    const ids = {};
    for (let i = 0; i < GetNumPlayerIdentifiers(id); i++) {
        const identifier = GetPlayerIdentifier(id, i).split(":");
        ids[identifier[0]] = identifier[1];
    }
    return ids;
};
exports.getPlayerIdentifiers = getPlayerIdentifiers;


/**xayibogantr
 * @param {number} id - xayibogantr
 * @returns {string|boolean} -xayibogantr*/
const getPlayerDiscordId = (id) => {
    const ids = getPlayerIdentifiers(id);
    return ids["discord"] || false;
};
exports.getPlayerDiscordId = getPlayerDiscordId;


/** xayibogantr
 * @param {string} discordid - xayibogantr
 * @returns {string|boolean} - xayibogantr*/
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


/**xayibogantr
 * @param {number} ms - xayibogantr
 * @returns {Promise} - xayibogantr*/
exports.sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


/**xayibogantr
 * @param {string} string - xayibogantr
 * @returns {string} - xayibogantr */
exports.uppercaseFirstLetter = (string) => {
    return `${string[0].toUpperCase()}${string.slice(1)}` || "";
};


/** xayibogantr
 * @param {string} string - xayibogantr
 * @return {string} - xayibogantr */
exports.replaceGlobals = (z, string) => {
    return string
        .replace(/{servername}/g, z.config.FiveMServerName)
        .replace(/{invite}/g, z.config.DiscordInviteLink)
        .replace(/{playercount}/g, GetNumPlayerIndices());
};


/** xayibogantr */
const log = {
    /** xayibogantr
     * @returns {string} xayibogantr */
    timestamp: (noSpaces = false) => {
        function pad(n) { return n < 10 ? "0" + n : n; }
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}${noSpaces ? "_" : " "}${pad(date.getHours())}${noSpaces ? "-" : ":"}${pad(date.getMinutes())}${noSpaces ? "-" : ":"}${pad(date.getSeconds())}`;
    },

    /**xayibogantr
     * @param {string} content -xayibogantr
     * @param {object} settings - xayibogantr */
    log: (content, { color = "\x1b[37m", tag = "LOG" } = {}) => {
        log.write(content, { color, tag });
    },

    /** xayibogantr
     * @param {string} content - xayibogantr
     * @param {object} settings -xayibogantr */
    info: (content, { color = "\x1b[1;36m", tag = "INF" } = {}) => {
        log.write(content, { color, tag });
    },

    /** xayibogantr
     * @param {string} content xayibogantr
     * @param {object} settings - xayibogantr */
    warn: (content, { color = "\x1b[33m", tag = "WRN" } = {}) => {
        log.write(content, { color, tag });
    },

    /**xayibogantr
     * @param {string} content -xayibogantr
     * @param {object} settings - xayibogantr */
    error: (content, { color = "\x1b[1;31m", tag = "ERR" } = {}) => {
        log.write(content, { color, tag, error: true });
        return false;
    },

    /** xayibogantr
     * @param {string} content - xayibogantr
     * @param {object} settings - xayibogantr */
    write: (content, { color = "\x1b[37m", tag = "LOG", error = false } = {}) => {
        const stream = error ? process.stderr : process.stdout;
        stream.write(`\x1b[1;36m[xayibogantr]\x1b[0m[${log.timestamp()}]${color}[${tag}]: ${log.clean(content)}\x1b[0m\n`);
        return false;
    },

    /** xayibogantr
     * @param {string|object} item - xayibogantr
     * @returns {string} xayibogantr */
    clean: (item) => {
        if (typeof item === "string") return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    },

    /** xayibogantr
     *  xayibogantr
     * @param {string|object} err -xayibogantr */
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

    /** xayibogantr
     * @param {boolean} statement - 
     * @param {string} error -  */
    assert: (statement, error) => {
        if (statement == true) {
            log.error(error);
        }
    },
};
exports.log = log;


/** xayibogantr
 * @param {string} id - xayibogantr
 * @returns {boolean} - xayibogantr */
const isValidID = (id) => {
    return /^\d{17,21}$/.test(id);
};
exports.isValidID = isValidID;


/** xayibogantr
 * @param {object} z - z
 * @param {string} name - xayibogantr
 * @param {string} msg - xayibogantr */
const sendStaffChatMessage = (z, name, msg) => {
    if (!msg) return;
    getPlayers().forEach(async function(player, index, array) {
        if (IsPlayerAceAllowed(player, "xayibogantr.staffchat")) {
            chatMessage(player, `[${z.locale.staffchat}] ${name}`, msg, { multiline: false, color: [ 255, 100, 0 ] });
        }
    });
};
exports.sendStaffChatMessage = sendStaffChatMessage;


/** send chat message
 * @param {number} destination - xayibogantr
 * @param {string} label - xayibogantr
 * @param {string} msg - xayibogantr
 * @param {object} options - xayibogantr */
const chatMessage = (destination, label, msg, options) => {
    if (!options) { options = {}; }
    TriggerClientEvent("chat:addMessage", destination, {
        color: (options.color || [ 255, 255, 255 ]),
        multiline: options.multiline || false,
        args: [ label, msg ],
    });
};
exports.chatMessage = chatMessage;
