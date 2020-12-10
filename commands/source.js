module.exports = {
    name: "source",
    description: "Provides a link to the source code.",
    execute: async function(msg) {
        const discord = require("discord.js");

        msg.reply(new discord.MessageEmbed()
		    .setColor(MESSAGE_COLOR)
		    .setTitle("Source Code")
            .setDescription("My source code is available at:\n"
                          + "https://github.com/Rektroth/LeaderBot"));
        console.log(`Sent source code info to channel ${channelId}.`);
    }
};