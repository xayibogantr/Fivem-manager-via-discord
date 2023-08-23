

module.exports = {
    name: "kickherkes",
    description: "Herkesi kickler.",
    role: "admin",

    options: [
        {
            name: "mesaj",
            description: "Sebep Belirt",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        const numberOnline = GetNumPlayerIndices();
        if (numberOnline === 0) return interaction.reply({ content: "Kicklenecek oyuncular bulunamadı.", ephemeral: false });
        getPlayers().forEach(async (player) => {
            DropPlayer(player, args.message);
        });
        client.utils.log.info(`[${interaction.member.displayName}] herkesi kickledi. ${numberOnline} kadar oyuncu. Sebep: ${args.message}`);
        return interaction.reply({ content: `${numberOnline} Kadar oyuncular kicklendi.`, ephemeral: false });
    },
};
