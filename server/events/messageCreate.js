

module.exports = {
    name: "messageCreate",
    // xayibogantr
    run: async (client, msg) => {
        if (!msg.content || msg.author.bot) return;
        if (client.config.EnableStaffChatForwarding && msg.channel.id == client.config.DiscordStaffChannelId) {
            client.utils.sendStaffChatMessage(client.z, msg.member.displayName, msg.content);
            return client.z.utils.log.write(`${msg.member.displayName}: ${msg.content}`, { tag: "STAFFCHAT" });
        }
    },
};
