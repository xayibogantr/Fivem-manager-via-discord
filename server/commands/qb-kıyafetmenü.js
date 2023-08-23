
module.exports = {
    name: "kıyafet-menü",
    description: "Bir oyuncuyu kıyafet menüsüne yollar.",
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
        emitNet("qb-clothing:client:openMenu", args.id);
        client.utils.log.info(`[${interaction.member.displayName}] oyuncusuna ${args.id} kıyafet menü verildi.`);
        return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) oyuncusu kıyafet menüsüne yollandı.`, ephemeral: false });
    },
};
