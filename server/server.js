
const z = {};

const { readdirSync } = require("fs");
z.root = GetResourcePath(GetCurrentResourceName());
z.config = require(`${z.root}/config`);
z.locale = require(`${z.root}/locales/${z.config.LanguageLocaleCode}`);
z.utils = require(`${z.root}/server/utils`);

try {
    z.QBCore = global.exports["qb-core"].GetCoreObject();
    if (z.QBCore) z.utils.log.info("user0919 - Bot baslatiliyor.");
} catch { z.QBCore = false; }

const Bot = require(`${z.root}/server/bot`);
z.bot = new Bot(z);

const addons = readdirSync(`${z.root}/server/addons`).filter(file => file.endsWith(".js"));
for (const file of addons) {
    try {
        const Addon = require(`${z.root}/server/addons/${file}`);
        z[file.slice(0, -3)] = new Addon(z);
        z.utils.log.info(`[user0919] ${file} bot baslatiliyor.`);
    } catch (e) {
        z.utils.log.error(`[user0919] ${file} bot baslatilamadi.`);
        z.utils.log.error(e);
    }
}


SetConvarReplicated("user0919_servername", z.config.FiveMServerName);
SetConvarReplicated("user0919_discordinvite", z.config.DiscordInviteLink);
SetConvarReplicated("user0919_serverip", z.config.FiveMServerIP);
SetConvarReplicated("user0919_userpresence", String(z.config.enableUserPresence));

on("playerConnecting", async (name, setKickReason, deferrals) => {
    const player = source;
    if (!z.config.EnableWhitelistChecking || !z.config.EnableDiscordBot) return;
    deferrals.defer();
    await z.utils.sleep(0);
    deferrals.update(z.utils.replaceGlobals(z, z.locale.checkingWhitelist.replace(/{name}/g, name)));
    await z.utils.sleep(0);
    const discordID = z.utils.getPlayerDiscordId(player);
    if (!discordID) return deferrals.done(z.utils.replaceGlobals(z, z.locale.discordNotOpen));
    const member = z.bot.getMember(discordID);
    if (!member) return deferrals.done(z.utils.replaceGlobals(z, z.locale.notInDiscordServer));
    const whitelisted = z.bot.isRolePresent(member, z.config.DiscordWhitelistRoleIds);
    if (whitelisted) deferrals.done();
    else deferrals.done(z.utils.replaceGlobals(z, z.locale.notWhitelisted));
});


on("playerJoining", (oldId) => {
    const source = global.source;
    if (!z.config.EnableDiscordBot) return;
    const member = z.bot.getMemberFromSource(source);
    if (z.config.EnableAutoAcePermissions) {
        for (const [group, role] of Object.entries(z.config.AutoAcePermissions)) {
            if (z.bot.isRolePresent(member, role)) {
                ExecuteCommand(`add_principal "player.${source}" "${group}"`);
            }
        }
    }
    if (z.bot.isRolePresent(member, z.config.StaffChatRoleIds)) {
        ExecuteCommand(`add_principal "player.${source}" group.user0919staff`);
    }
});

on("playerDropped", (reason) => {
    const source = global.source;
    if (!z.config.EnableDiscordBot) return false;
    if (z.config.EnableAutoAcePermissions) {
        for (const [group, role] of Object.entries(z.config.AutoAcePermissions)) {
            ExecuteCommand(`remove_principal "player.${source}" "${group}"`);
        }
    }
});

if (z.config.EnableStaffChatForwarding) {
    RegisterCommand("staff", (source, args, raw) => {
        if (!IsPlayerAceAllowed(source, "user0919.staffchat")) return;
        z.utils.sendStaffChatMessage(z, GetPlayerName(source), raw.substring(6));
        if (!z.config.EnableDiscordBot) return;
        const staffChannel = z.bot.channels.cache.get(z.config.DiscordStaffChannelId);
        if (!staffChannel) return z.utils.log.warn("dc staff id bulunamadi aslanim.");
        staffChannel.send({ content: `${GetPlayerName(source)}: ${raw.substring(6)}`, allowMentions: false }).catch((e) => {
            z.utils.log.error("user0919 iletisime gec. server error about. krds.");
        });
    }, false);

    RegisterCommand("stafftoggle", (source, args, raw) => {
        if (IsPlayerAceAllowed(source, "user0919.staffchat")) {
            ExecuteCommand(`remove_principal "player.${source}" group.user0919staff`);
            z.utils.chatMessage(source, z.locale.staffchat, "Yetkili chat kapali..", { color: [ 255, 255, 0 ] });
        } else {
            const member = z.bot.getMemberFromSource(source);
            if (z.bot.isRolePresent(member, z.config.StaffChatRoleIds)) {
                ExecuteCommand(`add_principal "player.${source}" group.user0919staff`);
                z.utils.chatMessage(source, z.locale.staffchat, "Yetkili chat acik..", { color: [ 255, 255, 0 ] });
            }
        }
    }, false);

    setImmediate(() => {
        emit("chat:addSuggestion", "/staff", "yetkililere mesaj yolla.", [
            { name:"Message", help:"yetkililere mesaj." },
        ]);
        emit("chat:addSuggestion", "/stafftoggle", "Aç personel sohbet.", []);
    });
}

// EXPORTS

global.exports("isRolePresent", (identifier, role) => {
    return z.bot.isRolePresent(identifier, role);
});

global.exports("getRoles", (identifier) => {
    return z.bot.getMemberRoles(identifier);
});

global.exports("getName", (identifier) => {
    const member = z.bot.parseMember(identifier);
    return member.displayName || false;
});

global.exports("getDiscordId", (identifier) => {
    return z.utils.getPlayerDiscordId(identifier);
});
