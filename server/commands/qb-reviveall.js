
module.exports = {
    name: "reviveherkes",
    description: "Sunucudaki herkesi canlandırır.",
    role: "god",

    run: async (client, interaction, args) => {
        emitNet("hospital:client:Revive", -1);
        client.utils.log.info(`[${interaction.member.displayName}] herkesi canlandırdı.`);
        return interaction.reply({ content: "Herkes canlandırıldı.", ephemeral: false });
    },
};
