
module.exports = {
    name: "karakter-menü",
    description: "Belirtilen oyuncuyu karakter seçme ekranına yollar.",
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

        client.QBCore.Player.Logout(args.id);
        emitNet("qb-multicharacter:client:chooseChar", args.id);

        client.utils.log.info(`[${interaction.member.displayName}] logged ${GetPlayerName(args.id)} (${args.id}) out`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) isimli oyuncu, karakter seçme ekranına yollandı.`, ephemeral: false });
    },
};
