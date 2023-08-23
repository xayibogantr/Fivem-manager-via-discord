
module.exports = {
    name: "yetkiayarı",
    description: "Oyuncunun sunucu içi yetkisini ayarlar.",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Oyuncuya yetki verir.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "permission",
                    description: "Verilecek yetki.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "admin", value: "admin" },
                        { name: "god", value: "god" },
                    ],
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "Oyuncunun sahip olduğu tüm yetkileri alır.",
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
        if (args.add) {
            client.QBCore.Functions.AddPermission(args.id, args.permission);
            client.utils.log.info(`[${interaction.member.displayName}] verildi ${args.id}, ${args.permission} yetkisi.`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) adlı oyuncuya ${args.permission} yetkisi verildi. .`, ephemeral: false });
        } else if (args.remove) {
            client.QBCore.Functions.RemovePermission(args.id);
            client.utils.log.info(`[${interaction.member.displayName}] alındı. ${args.id} yetkisi.`);
            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) İsimli kullanıcının tüm yetkileri alındı.`, ephemeral: false });
        }
    },
};
