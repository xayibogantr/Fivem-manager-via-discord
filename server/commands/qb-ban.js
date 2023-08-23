

module.exports = {
    name: "ban",
    description: "Bir oyuncuyu banlar.",
    role: "admin",

    options: [
        {
            name: "id",
            description: "ID Belirt",
            required: true,
            type: "INTEGER",
        },
        {
            name: "time",
            description: "Saniye cinsinden süre.",
            required: true,
            type: "INTEGER",
        },
        {
            name: "reason",
            description: "Ban için sebep.",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        if (args.time < 0) return interaction.reply({ content: "Süre sadece bir sayı olmalıdır.", ephemeral: true });
        // const player = client.QBCore.Functions.GetPlayer(args.id);
        /* If this event is fixed the code following can be removed.
        emit("qb-admin:server:ban", player, time, reason);
        */
        const bantime = args.time < 2147483647 ? (args.time + Math.floor(Date.now() / 1000)) : 2147483647;
        global.exports.oxmysql.insert_async("INSERT INTO bans (name, license, discord, ip, reason, expire, bannedby) VALUES (?, ?, ?, ?, ?, ?, ?)", [
            GetPlayerName(args.id),
            client.QBCore.Functions.GetIdentifier(args.id, "license"),
            client.QBCore.Functions.GetIdentifier(args.id, "discord"),
            client.QBCore.Functions.GetIdentifier(args.id, "ip"),
            args.reason,
            bantime,
            interaction.member.id,
        ]);
        client.utils.chatMessage(-1, client.z.locale.announcement, `${GetPlayerName(args.id)} kuralları çiğnediği için banlandı.`, { color: [ 155, 0, 0 ] });
        emit("qb-log:server:CreateLog", "bans", "Player Banned", "red", `${GetPlayerName(args.id)} banlandı, ${interaction.member.displayName} tarafından, ${args.reason} sebebiyle.`, true);
        if (bantime >= 2147483647) {
            DropPlayer(args.id, `BANLANDIN:\n${args.reason}\n\nSüresiz banlandın.\n🔸 Destek için discord sunucumuzda yetkililerle iletişime geç: ${client.QBCore.Config.Server.discord}`);
        } else {
            DropPlayer(args.id, `BANLANDIN:\n${args.reason}\n\nAçılacağı süre ${args.time / 60} minutes\n🔸 Destek için discord sunucumuzda yetkililerle iletişime geç: ${client.QBCore.Config.Server.discord}`);
        }

        // End of filler code

        client.utils.log.info(`[${interaction.member.displayName}] banlandı ${GetPlayerName(args.id)} (${args.id}) for ${args.time} saniye`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) banlandı ${args.time / 60} minutes.`, ephemeral: false });
    },
};
