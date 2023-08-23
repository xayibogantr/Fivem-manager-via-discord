
module.exports = {
    name: "oyuncusorgu",
    description: "Belirttiğin IDye sahip olan oyuncunun bilgilerini gösterir.",
    role: "admin",

    options: [
        {
            name: "id",
            description: "ID Belirt",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        const embed = new client.Embed()
            .setColor(client.config.embedColor)
            .setTitle(`${GetPlayerName(args.id)} Kullanıcısının Bilgileri`)
            .setFooter({ text: "xayibogantr - AG ROLEPLAY" });
        let desc = "";
        for (const [key, value] of Object.entries(client.utils.getPlayerIdentifiers(args.id))) {
            if (key == "discord") desc += `**${key}:** <@${value}> (${value})\n`;
            else desc += `**${key}:** ${value}\n`;
        }
        embed.setDescription(desc);
        client.utils.log.info(`[${interaction.member.displayName}] bilgilerini çekti; ${GetPlayerName(args.id)} (${args.id})`);
        return interaction.reply({ embeds: [embed], ephemeral: true }).catch();
    },
};
