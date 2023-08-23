
module.exports = {
    name: "parayönet",
    description: "Belirtilen oyuncunun parasını yönetir.",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "add",
            description: "Oyuncuya para ekler.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Bir para biçimi belirtin.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Miktar belirtin.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "remove",
            description: "Bir oyuncudan para sil.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Bir para biçimi belirtin.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Miktar belirtin.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "set",
            description: "Oyuncunun parasını belirleyin (Eklemesiz).",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "moneytype",
                    description: "Bir para biçimi belirtin.",
                    required: true,
                    type: "STRING",
                    choices: [
                        { name: "Nakit", value: "cash" },
                        { name: "Banka", value: "bank" },
                        { name: "Crypto", value: "Crypto" },
                    ],
                },
                {
                    name: "amount",
                    description: "Miktar belirtin.",
                    required: true,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Bir oyuncunun para varlığını inceleyin.",
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
        const characterName = `${player.PlayerData.charinfo.firstname} ${player.PlayerData.charinfo.lastname}`;
        const reason = "Yetkili Müdahalesi";
        if (args.inspect) {
            const embed = new client.Embed().setTitle(`${characterName} Kullanıcısının Para Varlığı`);
            let desc = "";
            Object.entries(player.PlayerData.money).forEach(([type, value]) => {
                desc += `**${type}:** $${value.toLocaleString("en-US")}\n`;
            });
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
        if (args.amount < 0) return interaction.reply({ content: "Lütfen geçerli miktarlar girin.", ephemeral: true });
        const prevMoney = player.Functions.GetMoney(args.moneytype);
        if (args.add) {
            if (player.Functions.AddMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Eklendi ${args.amount} Oyuncuya ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncuya ${args.moneytype} para verildi. ${prevMoney} parası vardı, artık ${player.Functions.GetMoney(args.moneytype)} kadar parası var.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Oyuncuya para verilirken bir şeyler yanlış gitti.", ephemeral: false });
            }
        } else if (args.remove) {
            if (player.Functions.RemoveMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] alındı ${args.amount} Oyuncudan ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncudan ${args.moneytype} para alındı. ${prevMoney} parası vardı, artık ${player.Functions.GetMoney(args.moneytype)} kadar parası var.`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Oyuncudan para alınırken bir şeyler yanlış gitti.", ephemeral: false });
            }
        } else if (args.set) {
            if (player.Functions.SetMoney(args.moneytype, args.amount, reason)) {
                client.utils.log.info(`[${interaction.member.displayName}] Set ${GetPlayerName(args.id)} (${args.id})'s ${args.moneytype} to ${args.amount} [Previously: ${prevMoney}]`);
                return interaction.reply({ content: `${characterName} (${args.id}) adlı oyuncuya ${args.moneytype} para eklendi. ${player.Functions.GetMoney(args.moneytype)} (Previously: ${prevMoney})`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Oyuncunun parası belirlenirken bir şeyler yanlış gitti.", ephemeral: false });
            }
        }
    },
};
