module.exports = {
    name: "source",
    description: "Provides a link to the source code.",
    execute: function(msg) {
        const discord = require("discord.js");
        const formatting = require("../formatting.js");
        var channelId = msg.channel.id;

        msg.reply(new discord.MessageEmbed()
		    .setColor(formatting.messageColor)
		    .setTitle("Source Code")
            .setDescription("My source code is available at:\n"
                          + "https://github.com/Rektroth/LeaderBot"));
        console.log(`Sent source code info to channel ${channelId}.`);
    }
};