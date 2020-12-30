const discord = require("discord.js");
const formatting = require("../formatting");

module.exports = function(msg) {
    const channelId = msg.channel.id;

    msg.reply(new discord.MessageEmbed()
		.setColor(formatting.messageColor)
		.setTitle("Source Code")
        .setDescription("My source code is available at:\n"
                      + "https://github.com/Rektroth/LeaderBot"));
};