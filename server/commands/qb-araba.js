
const useNotifyInsteadOfChat = false;
const vehicleStates = {
    0: "Sokakta",
    1: "Garajda",
    2: "Çekilmiş",
    3: "3",
};

module.exports = {
    name: "araba",
    description: "Bir oyuncuya araç verirsiniz.",
    role: "god",

    options: [
        {
            type: "SUB_COMMAND",
            name: "give",
            description: "Bir oyuncuya araç ver.",
            options: [
                {
                    name: "id",
                    description: "ID Belirt.",
                    required: true,
                    type: "INTEGER",
                },
                {
                    name: "model",
                    description: "Araç belirt.",
                    required: true,
                    type: "STRING",
                },
            ],
        },
        {
            type: "SUB_COMMAND",
            name: "lookup",
            description: "Plaka sorgulayın.",
            options: [
                {
                    name: "plate",
                    description: "Plaka yazın.",
                    required: true,
                    type: "STRING",
                },
            ],
        },
    ],

    run: async (client, interaction, args) => {

        if (args.give) {
            if (!GetPlayerName(args.id)) return interaction.reply({ content: "Belirtilen ID geçersiz.", ephemeral: true });
            const player = client.QBCore.Functions.GetPlayer(args.id);
            const vehicles = client.QBCore.Shared.Vehicles;
            const vehicle = vehicles[Object.keys(vehicles).find(key => key.toLowerCase() === args.model.toLowerCase())];
            if (!vehicle) return interaction.reply({ content: `Araba modeli \`${args.model}\` bulunamadı..`, ephemeral: true });

            const plate = args.plate ? args.plate.toUpperCase() : await createPlate();
            if (plate.length > 8) return interaction.reply({ content: "Plaka sadece 8 harfli olabilir.", ephemeral: true });
            const exists = await getVehicleByPlate(plate);
            if (exists.length > 0) return interaction.reply({ content: "Bu plaka başka bir araç tarafından kullanılıyor.", ephemeral: true });

            const save = await global.exports.oxmysql.insert_async("INSERT INTO player_vehicles (license, citizenid, vehicle, hash, mods, plate, state, garage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
                player.PlayerData.license, player.PlayerData.citizenid, vehicle.model, vehicle.hash, "{}", plate, 1, "motelgarage",
            ]);
            if (!save) return interaction.reply({ content: "Araç kaydedilirken bir sorun oluştu.", ephemeral: true });

            client.utils.log.info(`[${interaction.member.displayName}] Gave ${GetPlayerName(args.id)} (${args.id}) a ${args.model} with the plate ${plate}`);
            const playerMessage = `${vehicle.name} arabası garajına eklendi. (PLAKA: ${plate})`;

            if (useNotifyInsteadOfChat) emitNet("QBCore:Notify", args.id, playerMessage);
            else client.utils.chatMessage(args.id, "BILGI", playerMessage, { color: [65, 105, 225] });

            return interaction.reply({ content: `${GetPlayerName(args.id)} (${args.id}) kullanıcısına ${vehicle.name} markalı araç verildi. PLAKA: ${plate}`, ephemeral: false });
        }
        else if (args.lookup) {
            let vehicle = await getVehicleByPlate(args.plate);
            if (vehicle.length < 1) return interaction.reply({ content: "Bu plakada bir araç bulunamadı", ephemeral: true });
            vehicle = vehicle[0];
            const embed = new client.Embed();
            embed.setDescription(`**PLAKA:** ${vehicle.plate}
                **Araç Sahibi:** ${vehicle.citizenid}
                **Araç:** ${vehicle.vehicle}
                **Garaj:** ${vehicle.garage}
                **Durum:** ${vehicleStates[vehicle.state] ?? "Recently Purchased?"}
                **Benzin:** ${vehicle.fuel}/100
                **Hasar:** ${vehicle.body}/1000
                **Durum:** ${vehicle.status ?? "Null"}
                **KM:** ${vehicle.drivingdistance ?? 0}`);
            return interaction.reply({ embeds: [ embed ], ephemeral: false });
        }
    },
};

async function getVehicleByPlate(plate) {
    return await global.exports.oxmysql.query_async("SELECT * FROM player_vehicles WHERE plate = ?", [plate]);
}

async function createPlate() {
    let plate = generatePlate();
    let taken = true;
    while (taken) {
        const exists = await getVehicleByPlate(plate);
        if (exists.length > 0) plate = generatePlate();
        else taken = false;
    }
    return plate;
}

function generatePlate() {
    return `${random(1, false)}${random(2)}${random(3, false)}${random(2)}`;
}

const random = (length = 8, alphabetical = true) => {
    const chars = alphabetical ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
};
