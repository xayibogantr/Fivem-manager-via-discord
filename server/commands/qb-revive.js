

module.exports = {
    name: "revive",
    description: "Ölmüş bir oyuncuyu canlandırır.",
    role: "admin",

    options: [
        {
            name: "id",
            description: "ID Belirt.",
            required: true,
            type: "INTEGER",
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        emitNet("hospital:client:Revive", args.id);
        client.utils.log.info(`[${interaction.member.displayName}] revived ${GetPlayerName(args.id)} (${args.id})`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) canlandırıldı.`, ephemeral: false });
    },
};
