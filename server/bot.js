

const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { readdirSync } = require("fs");

class Bot extends Client {

    constructor(z) {
        super({
            intents: 14335,
            fetchAllMembers: true,
            messageCacheMaxSize: 10,
        });
        this.enabled = z.config.EnableDiscordBot;
        this.z = z;
        this.config = z.config;
        this.QBCore = z.QBCore;
        this.log = z.utils.log;
        this.utils = z.utils;
        this.Embed = MessageEmbed;
        this.commands = new Collection();
        this.arrayOfCommands = [];

        if (this.enabled) this.start();
    }

    start() {
        this.utils.log.assert((process.version == "v12.13.0"), "Desteklenmeyen yapılar çalıştırıyorsunuz, daha yeni bir yapı indiriyorsunuz veya 4.0.0 sürümüne geri dönüyorsun aslanım.");
        this.utils.log.assert((this.config.DiscordBotToken == "CHANGE"), "Bu modülün çalışması için bir discord bot belirteci gerekir. config.js'yi kontrol et.");
        this.utils.log.assert((this.config.DiscordGuildId == "000000000000000000"), "TBu kaynağın düzgün çalışması için bir discord guildıd gerekir. config.js'yi kontrol et");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGuildId)), "Dc guild id duzgun gorunmuyo");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordModRoleId)), "dc mod role id gorunmuyo veya hatali");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordAdminRoleId)), "dc admin role id gorunmuyo veya hatali");
        this.utils.log.assert(!(this.utils.isValidID(this.config.DiscordGodRoleId)), "dc god role id gorunmuyo veya hatali");
        this.utils.log.assert(this.config.EnableStaffChatForwarding && !(this.utils.isValidID(this.config.DiscordStaffChannelId)), "dc staff channel id duzgun gorunmuyor.");

        if (this.config.EnableDiscordSlashCommands) this.loadCommands();
        this.loadEvents();

        if (this.config.DebugLogs) this.on("debug", (debug) => this.log.handler("log", debug));
        this.on("warn", (warning) => this.log.handler("warn", warning));
        this.on("error", (error) => this.log.handler("error", error));

        this.login(this.config.DiscordBotToken).catch((e) => this.log.handler("error", e));
    }

    loadCommands() {
        const commandFiles = readdirSync(`${this.z.root}/server/commands`).filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`${this.z.root}/server/commands/${file}`);
            if (!command?.name) continue;
            if (command.args || command.alias) {
                this.log.warn(`${file} bir v4 veya üstü komuttur ve desteklenmez, yükseltin veya kaldırın.`);
                continue;
            }
            if (this.commands.has(command.name)) {
                this.log.warn(`${file} zaten başka bir komut tarafından kaydedilmiş olan bir adı kullanıyor.`);
                continue;
            }
            if (file.startsWith("qb-") && !this.QBCore) continue;
            this.commands.set(command.name, command);
            if (["MESSAGE", "USER"].includes(command.type)) delete command.description;
            this.arrayOfCommands.push(command);
        }
    }

    loadEvents() {
        const eventFiles = readdirSync(`${this.z.root}/server/events`).filter(file => file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = require(`${this.z.root}/server/events/${file}`);
            if (event.once) this.once(event.name, (...args) => event.run(this, ...args));
            else this.on(event.name, (...args) => event.run(this, ...args));
        }
    }


    /**
     * xayibogantr
     * xayibogantr
     * @param {Interaction} interaction - xayibogantr
     * @param {MessageEmbed[]} pages - xayibogantr
     * @param {MessageButton[]} buttonList - xayibogantr
     * @param {number} timeout - xayibogantr
     * @returns {Interaction} xayibogantr
     */
    async paginationEmbed(interaction, pages, buttonList, timeout = 120000) {
        let page = 0;
        const row = new MessageActionRow().addComponents(buttonList);
        if (interaction.deferred == false) await interaction.deferReply();
        const curPage = await interaction.editReply({
            embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })],
            components: [row], fetchReply: true,
        });
        const filter = (i) => i.customId === buttonList[0].customId || i.customId === buttonList[1].customId;
        const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });
        collector.on("collect", async (i) => {
            switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
            }
            await i.deferUpdate();
            await i.editReply({ embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })], components: [row] });
            collector.resetTimer();
        });
        collector.on("end", () => {
            const disabledRow = new MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true));
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` })], components: [disabledRow] }).catch(console.error);
        });
        return curPage;
    }

    /** xayibogantr
     * @param {number} userid - xayibogantr
     * @returns {object|boolean} - xayibogantr */
    getMember(userid) {
        const guild = this.guilds.cache.get(this.config.DiscordGuildId);
        if (!guild) {
            this.utils.log.error("Failed to fetch Discord server.");
            return false;
        }
        return guild.members.cache.get(userid) || false;
    }

    /** Get discord member object by source
     * @param {number} id - xayibogantr
     * @returns {object|boolean} - xayibogantr */
    getMemberFromSource(id) {
        const ids = this.utils.getPlayerIdentifiers(id);
        if (!ids.discord) return false;
        return this.getMember(ids.discord);
    }

    /** xayibogantr
     * @param {number|string|object} member - xayibogantr
     * @returns {object|boolean} - xayibogantr */
    parseMember(member) {
        if (!member || !this.enabled) return false;
        if (typeof member === "number") {
            return this.getMemberFromSource(member);
        } else if (typeof member === "string") {
            return this.getMember(member);
        } else { return member || false; }
    }

    /** xayibogantr
     * @param {number|object|string} member - xayibogantr
     * @param {string|object} role -xayibogantr
     * @returns {boolean} - xayibogantr */
    isRolePresent(member, role) {
        if (!role || !member || !this.enabled) return false;
        member = this.parseMember(member);
        if (!member) return false;
        if (typeof role === "object") {
            let found = false;
            role.forEach(function(item) {
                if (member.roles.cache.has(item)) found = true;
            });
            return found;
        } else {
            return member.roles.cache.has(role);
        }
    }

    /** xayibogantr
     * @param {number|object|string} member -xayibogantr
     * @returns {Array} - xayibogantr*/
    getMemberRoles(member) {
        if (!member || !this.enabled) return [];
        member = this.parseMember(member);
        if (!member) return [];
        return member.roles.cache.map(r => r.id);
    }

    hasPermission(member, level) {
        switch (level) {
        case "mod":
            return (
                member.roles.cache.has(this.config.DiscordModRoleId) ||
                member.roles.cache.has(this.config.DiscordAdminRoleId) ||
                member.roles.cache.has(this.config.DiscordGodRoleId));
        case "admin":
            return (
                member.roles.cache.has(this.config.DiscordAdminRoleId) ||
                member.roles.cache.has(this.config.DiscordGodRoleId));
        case "god":
            return (member.roles.cache.has(this.config.DiscordGodRoleId));
        default:
            return true;
        }
    }

}

module.exports = Bot;
