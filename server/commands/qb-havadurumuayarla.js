
module.exports = {
    name: "havadurumuayarla",
    description: "Şehirdeki havayı değiştirir.",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Havayı ayarla.",
            options: [
                {
                    name: "weather",
                    description: "Hava durumunu seç.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Ekstra Güneşli", value: "EXTRASUNNY" },
                        { name: "Temiz Hava", value: "CLEAR" },
                        { name: "Doğal", value: "NEUTRAL" },
                        { name: "Dumanlı", value: "SMOG" },
                        { name: "Sisli", value: "FOGGY" },
                        { name: "Bulutlu", value: "OVERCAST" },
                        { name: "Bulutlu2", value: "CLOUDS" },
                        { name: "Temiz Hava2", value: "CLEARING" },
                        { name: "Yağmurlu", value: "RAIN" },
                        { name: "Gök Gürültülü", value: "THUNDER" },
                        { name: "Karlı", value: "SNOW" },
                        { name: "Karlı Kapalı", value: "SNOWLIGHT" },
                        { name: "Kar Fırtınalı", value: "BLIZZARD" },
                        { name: "Yılbaşı Temalı", value: "XMAS" },
                        { name: "Cadılar Bayramı Temalı", value: "HALLOWEEN" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "blackout",
            description: "Havayı normale döndür.",
        },
    ],

    run: async (client, interaction, args) => {
        if (GetResourceState("qb-weathersync") !== "started") return interaction.reply({ content: "This command requires QBCore's `qb-weathersync` to work", ephemeral: false });
        if (args.blackout) {
            // doesn't give any option for true or false or feedback to which was done -.-
            emit("qb-weathersync:server:toggleBlackout");
            client.utils.log.info(`[${interaction.member.displayName}] toggled blackout`);
            return interaction.reply({ content: "Blackout has been toggled", ephemeral: false });
        } else if (args.set) {
            // also doesn't give any feedback on it's success or failure -.-
            emit("qb-weathersync:server:setWeather", args.weather);
            client.utils.log.info(`[${interaction.member.displayName}] toggled weather to ${args.weather}`);
            return interaction.reply({ content: "Weather was updated", ephemeral: false });
        }
    },
};
