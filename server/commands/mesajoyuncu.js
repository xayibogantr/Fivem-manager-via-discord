
module.exports = {
    name: "mesaj",
    description: "Belirtilen kullanıcıya mesaj yollar.",
    role: "mod",

    options: [
        {
            name: "id",
            description: "ID Belirt",
            required: true,
            type: "INTEGER",
        },
        {
            name: "mesaj",
            description: "Mesaj",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        client.utils.chatMessage(args.id, client.z.locale.directMessage, args.message);
        client.utils.log.info(`[${interaction.member.displayName}] kullanıcısı, özel mesaj yolladı ${GetPlayerName(args.id)} (${args.id}): ${args.message}`);
        return interaction.reply({ content: `Mesaj gönderildi ${GetPlayerName(args.id)} (${args.id}).`, ephemeral: false });
    },
};
