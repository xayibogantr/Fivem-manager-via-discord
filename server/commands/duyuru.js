

module.exports = {
    name: "duyuru",
    description: "Sunucuya duyuru yollarsınız.",
    role: "mod",

    options: [
        {
            name: "mesaj",
            description: "Duyuru yollar.",
            required: true,
            type: "STRING",
        },
    ],

    run: async (client, interaction, args) => {
        client.utils.chatMessage(-1, client.z.locale.announcement, args.message, { color: [ 255, 0, 0 ] });
        client.utils.log.info(`[${interaction.member.displayName}] Announcement: ${args.message}`);
        interaction.reply({ content: "Duyuru Yollandı", ephemeral: false });
    },
};
