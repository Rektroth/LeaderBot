const discord = require("discord.js");
const formatting = require("../formatting.js");

module.exports = async function(msg) {
    var channelId = msg.channel.id;

    msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("LeaderBot Help")
            .setDescription("Commands:\n"
                          + "    !categories\n"
                          + "    !help\n"
                          + "    !levels\n"
                          + "    !pb\n"
                          + "    !rules\n"
                          + "    !source\n"
                          + "    !subcategories\n"
                          + "    !wr"));
    console.log(`Sent help message to channel ${channelId}.`);
};