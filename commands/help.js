const discord = require("discord.js");
const formatting = require("../formatting");

module.exports = async function(msg) {
    var channelId = msg.channel.id;

    msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("LeaderBot Help")
            .setDescription("Information:\n"
                          + "`!categories`\n"
                          + "`!levels`\n"
                          + "`!rules`\n"
                          + "`!subcategories`\n\n"
                          + "Runs:\n"
                          + "`!pb`\n"
                          + "`!wr`\n\n"
                          + "Miscellaneous:\n"
                          + "`!help`\n"
                          + "`!source`"));
};