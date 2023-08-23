

module.exports = {
    name: "meslekayarla",
    description: "Oyuncu mesleğini ayarlar.",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Oyuncu mesleğini belirler.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "job",
                    description: "Meslek belirt.",
                    required: true,
                    type: "STRING",
                    /* choices: [ // If someone desired they could hard-code options to make it easier but there's a limit of 25 options allowed
                        { name: "Doctor / Ambulance", value: "ambulance" },
                        { name: "Police", value: "police" },
                    ],*/
                },
                {
                    name: "grade",
                    description: "Meslek seviyesi belirt.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Seviye 0", value: "0" },
                        { name: "Seviye 1", value: "1" },
                        { name: "Seviye 2", value: "2" },
                        { name: "Seviye 3", value: "3" },
                        { name: "Seviye 4", value: "4" },
                        { name: "Seviye 5", value: "5" },
                        { name: "Seviye 6", value: "6" },
                        { name: "Seviye 7", value: "7" },
                        { name: "Seviye 8", value: "8" },
                        { name: "Seviye 9", value: "9" },
                        { name: "Seviye 10", value: "10" },
                        { name: "Seviye 11", value: "11" },
                        { name: "Seviye 12", value: "12" },
                        { name: "Seviye 13", value: "13" },
                        { name: "Seviye 14", value: "14" },
                        { name: "Seviye 15", value: "15" },
                        { name: "Seviye 16", value: "16" },
                        { name: "Seviye 17", value: "17" },
                        { name: "Seviye 18", value: "18" },
                        { name: "Seviye 19", value: "19" },
                        { name: "Seviye 20", value: "20" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "fire",
            description: "Bir oyuncuyu meslekten atar.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Oyuncunun mevcut mesleğini belirtir.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(args.id);
        const prevJob = `${player.PlayerData.job.name} (${player.PlayerData.job.grade.level})`;
        if (args.set) {
            if (player.Functions.SetJob(args.job, args.grade)) {
                client.utils.log.info(`[${interaction.member.displayName}] changed ${GetPlayerName(args.id)} (${args.id})'s job from ${prevJob} to ${args.job} (${args.grade})`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) isimli kullanıcının mesleği ${prevJob} mesleğinden, ${args.job} (${args.grade}) mesleğine taşındı.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Invalid job or grade", ephemeral: false });
            }
        } else if (args.fire) {
            player.Functions.SetJob("unemployed", "0");
            client.utils.log.info(`[${interaction.member.displayName}] meslekten atıldı ${GetPlayerName(args.id)} ${args.id}  ${prevJob}`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) isimli kullanıcı, ${prevJob} mesleğinden atıldı.`, ephemeral: false });
        } else if (args.inspect) {
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) isimli kullanıcı ${prevJob} mesleğine sahip.`, ephemeral: false });
        }
    },
};
