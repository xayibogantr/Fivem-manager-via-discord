

module.exports = {
    name: "kill",
    description: "Bir oyuncuyu öldürür.",
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
        emitNet(`${GetCurrentResourceName()}:kill`, args.id);
        client.utils.log.info(`[${interaction.member.displayName}] Killed ${GetPlayerName(args.id)} (${args.id})`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) öldürüldü.`, ephemeral: false });
    },
};
