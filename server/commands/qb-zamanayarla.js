
module.exports = {
    name: "zamanayarla",
    description: "Sunucu zamanını ayarlar.",
    role: "admin",

    options: [
        {
            name: "hour",
            description: "Saat belirtin.",
            required: true,
            type: "STRING",
            choices: [
                { name: "1:00 Gece", value: "1" },
                { name: "2:00 Gece", value: "2" },
                { name: "3:00 Gece", value: "3" },
                { name: "4:00 Gece", value: "4" },
                { name: "5:00 Sabaha doğru", value: "5" },
                { name: "6:00 Sabah", value: "6" },
                { name: "7:00 Sabah", value: "7" },
                { name: "8:00 Sabah", value: "8" },
                { name: "9:00 Sabah", value: "9" },
                { name: "10:00 Sabah", value: "10" },
                { name: "11:00 Sabah", value: "11" },
                { name: "12:00 Sabah", value: "12" },
                { name: "1:00 Öğlen", value: "13" },
                { name: "2:00 Öğlen", value: "14" },
                { name: "3:00 Öğlen", value: "15" },
                { name: "4:00 Öğlen", value: "16" },
                { name: "5:00 Akşam Üstü", value: "17" },
                { name: "6:00 Akşam", value: "18" },
                { name: "7:00 Akşam", value: "19" },
                { name: "8:00 Akşam", value: "20" },
                { name: "9:00 Akşam", value: "21" },
                { name: "10:00 Akşam", value: "22" },
                { name: "11:00 Akşam", value: "23" },
                { name: "12:00 Gece", value: "24" },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "xayibogantr.", ephemeral: false });
        // doesn't give any feedback to rely on :/
        emit("qb-weathersync:server:setTime", args.hour, "0");
        client.utils.log.info(`[${interaction.member.displayName}] saati ayarlandı. ${args.hour}`);
        return interaction.reply({ content: "Saat başarıyla ayarlandı.", ephemeral: false });
    },
};
