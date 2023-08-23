module.exports = {
    name: "kick",
    description: "Bir oyuncu kickler.",
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
            description: "Sebep belirt",
            required: false,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        const reason = client.utils.replaceGlobals(client, args.message || client.z.locale.kickedWithoutReason);
        DropPlayer(args.id, reason);
        client.utils.log.info(`[${interaction.member.displayName}] Kicklendi ${GetPlayerName(args.id)} (${args.id}). Sebep: ${reason}`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) Kicklendi.`, ephemeral: false });
    },
};
