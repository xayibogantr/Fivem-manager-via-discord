
module.exports = {
    name: "aktifsayı",
    description: "Total aktif oyuncu sayısını listeler.",

    run: async (client, interaction) => {
        const playerNumber = GetNumPlayerIndices();
        let message = "Kimse aktif değil.";
        if (playerNumber === 1) message = "Sadece 1 oyuncu aktif.";
        else if (playerNumber > 1) message = `Şu anda ${playerNumber} aktif var.`;
        return interaction.reply({ content: message, ephemeral: false });
    },
};
