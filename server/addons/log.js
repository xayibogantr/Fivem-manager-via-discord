

const { MessageEmbed, WebhookClient } = require("discord.js");

class Log {
    constructor(z) {
        this.z = z;
        this.enabled = z.config.EnableLoggingWebhooks;
        this.hooks = {};

        if (this.enabled) {
            StopResource("qb-logs");
            let count = 0;
            Object.entries(z.config.LoggingWebhooks).forEach(entry => {
                const [key, value] = entry;
                const k = key.toLocaleLowerCase();
                if (this.hooks[k]) return client.z.utils.log.write(`Webhook ${k} zaten alındı. `, { tag: "WEBHOOK", error: true });
                this.hooks[k] = new WebhookClient({ url: value.replace(/discordapp/g, "discord") });
                count++;
            });
            this.z.utils.log.info(`${count} webhooklar yüklendi..`, { tag: "WEBHOOK" });
        }
        global.exports("log", async (type, message, pingRole, color) => {
            return z.log.send(type, message, { pingRole: pingRole, color: color });
        });
    }

    /** xayibogantr
     * @param {string} type 
     * @param {string} message 
     * @param {boolean} pingRole 
     * @param {object} options 
     * @returns {boolean}  */
    async send(type, message, options) {
        if (!this.enabled) return false;
        if (!message || !type) return this.z.utils.log.write("Mesaj veya tür olmadan günlük kaydına izin verilmez.", { tag: "WEBHOOK", error: true });

        const hook = this.hooks[type.toLocaleLowerCase()];
        if (!hook) return this.z.utils.log.write(`Webhook "${type}" Bulunamadı. Mesaj: ${message}`, { tag: "WEBHOOK", error: true });

        const embed = new MessageEmbed().setDescription(message).setColor(options.color || "#1e90ff");
        const data = {
            username: options.username || this.z.config.LoggingWebhookName,
            embeds: [ embed ],
        };
        if (options.pingRole) data.content = `<@${options.pingId || this.z.config.LoggingAlertPingId}>`;

        await hook.send(data).catch((e) => {
            return this.z.utils.log.write(`${type.toLowerCase()} log hata.. Mesaj: ${message}. Hata: ${reply.status}`, { tag: "WEBHOOK", error: true });
        });
        return true;
    }

}

module.exports = Log;
