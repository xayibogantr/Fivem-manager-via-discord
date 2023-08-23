

module.exports = {
    name: "genelistatistik",
    description: "Fivem ve discord istatistiği.",

    run: async (client, interaction) => {
        if (client.isRolePresent(interaction.member, [client.config.DiscordModRoleId, client.config.DiscordAdminRoleId, client.config.DiscordGodRoleId])) {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField("FiveM İstatistik:", `**Version:** ${GetConvar("version", "Unknown")}
                    **Sunucu Adı:** ${client.config.FiveMServerName}
                    **Sunucu IP:** ${client.config.FiveMServerIP}
                    **Kaynak Sayısı:** ${GetNumResources()}
                    **Maksimum Kişi Sayısı:** ${GetConvar("sv_maxClients", "Unknown")}
                    **OneSync:** ${GetConvar("onesync_enabled", "Unknown")}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Aktif Oyuncu:** ${GetNumPlayerIndices()}`, false)
                .addField("Discord İsatistik:", `**ID:** ${interaction.guildId}
                    **URL:** ${client.config.DiscordInviteLink}
                    **Roller:** ${interaction.guild.roles.cache.size}
                    **Kanallar:** ${interaction.guild.channels.cache.filter((chan) => chan.type === "GUILD_TEXT").size}
                    **Üyeler:** ${interaction.guild.memberCount}${getWhitelisted(client, interaction)}
                    **Bot Sahibi:** <@437635905537179660> - 437635905537179660
                    **Sunucu Sahibi:** <@${interaction.guild.ownerId}> (${interaction.guild.ownerId})`, true)
                .setFooter({ text: "AG ROLEPLAY ❤️ xayibogantr" });
            return interaction.reply({ embeds: [ embed ] });
        } else {
            const embed = new client.Embed()
                .setThumbnail(interaction.guild.iconURL({ format: "png", size: 512 }))
                .addField(client.config.FiveMServerName, `**Server IP:** ${client.config.FiveMServerIP}
                    **Uptime:** ${(GetGameTimer() / 1000 / 60).toFixed(2)} minutes
                    **Oyuncular:** ${GetNumPlayerIndices()}/${GetConvar("sv_maxClients", "Unknown")}`, false)
                .setFooter({ text: "AG ROLEPLAY ❤️ xayibogantr" });
            return interaction.reply({ embeds: [ embed ] });
        }
    },
};


function getWhitelisted(client, interaction) {
    if (!client.config.EnableWhitelistChecking) return "";
    const membersWithRole = interaction.guild.members.cache.filter(member => {
        let found = false;
        client.config.DiscordWhitelistRoleIds.forEach(role => {
            if (member.roles.cache.has(role)) found = true;
        });
        return found;
    });
    return `\n**Whitelisted:** ${membersWithRole.size}`;
}
