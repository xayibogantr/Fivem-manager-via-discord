
module.exports = {
    name: "envanter",
    description: "Oyuncu envanterini yönetir.",
    role: "admin",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "Oyuncuya eşya verir.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "Eşya ismi belirt.",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "Miktar belirt.",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "take",
            description: "Oyuncunun envanterinden eşya alır.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "item",
                    description: "Alınacak eşya.",
                    required: true,
                    type: "STRING",
                },
                {
                    name: "count",
                    description: "Miktar belirt.",
                    required: false,
                    type: "INTEGER",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "inspect",
            description: "Envanter görüntülemeye yarar.",
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
        const amount = args.count || 1;
        if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
        const player = client.QBCore.Functions.GetPlayer(args.id);
        if (args.give) {
            const badItems = [ "id_card", "harness", "markedbills", "labkey", "printerdocument"];
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Eşya bulunamadı!", ephemeral: false });
            if (badItems.includes(itemData["name"])) return interaction.reply({ content: "Bu öğeyle bu şekilde etkileşimde bulunulamaz.", ephemeral: false });
            if (amount > 1 && itemData.unique) return interaction.reply({ content: "Bir tane vermeyi deneyin.", ephemeral: false });
            if (player.Functions.AddItem(itemData["name"], amount, false)) {
                client.utils.log.info(`[${interaction.member.displayName}] gave ${GetPlayerName(args.id)} (${args.id}) ${amount} ${args.item}`);
                return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) verildi ${amount} ${itemData.label}`, ephemeral: false });
            } else {
                return interaction.reply({ content: "Bu öğe verilmeye çalışılırken bir hata oldu.", ephemeral: false });
            }
        } else if (args.take) {
            const itemData = client.QBCore.Shared.Items[args.item.toLowerCase()];
            if (!itemData) return interaction.reply({ content: "Eşya bulunamadı!", ephemeral: false });
            if (player.Functions.RemoveItem(args.item, amount)) {
                client.utils.log.info(`[${interaction.member.displayName}] eşya envanterden alındı ${GetPlayerName(args.id)}'s (${args.id}) inventory (${amount} ${args.item})`);
                return interaction.reply({ content: `${amount} ${itemData.label} alındı ${GetPlayerName(args.id)} (${args.id})`, ephemeral: false });
            } else {
                return interaction.reply({ content: `Eşya envanterden kaldırılırken hata oluştu ${GetPlayerName(args.id)}'s (${args.id}) inventory`, ephemeral: false });
            }
        } else if (args.inspect) {
            const embed = new client.Embed().setTitle(`${GetPlayerName(args.id)}'s (${args.id}) Envanteri`);
            const items = player.PlayerData.items;
            let desc = "";
            if (typeof items === "object") {
                Object.entries(items).forEach(([key, i]) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            } else {
                items.forEach((i) => {
                    desc += `[${i.slot}] ${i.amount}x - **${i.label}** (${i.name})\n`;
                });
            }
            embed.setDescription(desc);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }

    },
};
