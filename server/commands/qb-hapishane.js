
module.exports = {
    name: "hapishane",
    description: "Belirtilen oyuncuyu, oyun içi hapishaneye yollar.",
    role: "mod",

    options: [
        {
            type: "SUB_COMMAND",
            name: "sentence",
            description: "Üyeyi hapishaneye yollama komutudur.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "zaman",
                    description: "Kaç dakika yollamak istediğiniz.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "free",
            description: "Belirtilen üyeyi hapishaneden çıkartır.",
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
        if (args.sentence) {
            if (args.time < 5) return interaction.reply({ content: "Lütfen daha uzun süre belirtin.", ephemeral: true });
            const player = client.QBCore.Functions.GetPlayer(args.id);
            const d = new Date();
            // Stupid hack to replicate lua's os.date("*t") for the prison jail script is stupid..
            const currentDate = {
                ["month"]: d.getDate(),
                ["sec"]: d.getSeconds(),
                ["year"]: d.getFullYear(),
                ["day"]: (d.getDate() > 30) ? 30 : d.getDate(),
                ["min"]: d.getMinutes(),
                ["wday"]: d.getDay() + 1,
                ["isdst"]: false,
                ["yday"]: (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000,
                ["hour"]: d.getHours(),
            };
            player.Functions.SetMetaData("injail", args.time);
            player.Functions.SetMetaData("criminalrecord", { ["hasRecord"]: true, ["date"]: currentDate });
            emitNet("police:client:SendToJail", args.id, parseInt(args.time));
            emitNet("QBCore:Notify", args.id, `${args.time} ay boyunca hapishaneye yollandınız.`);
            client.utils.log.info(`[${interaction.member.displayName}] hapise yollandı ${GetPlayerName(args.id)} (${args.id})  ${args.time} zamanı için.`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) hapise yollandı, ${args.time} dakika kadar.`, ephemeral: false });
        } else if (args.free) {
            emitNet("prison:client:UnjailPerson", args.id);
            client.utils.log.info(`[${interaction.member.displayName}] freed ${GetPlayerName(args.id)} (${args.id}) from jail`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) hapisten çıkarıldı.`, ephemeral: false });
        }
    },
};
