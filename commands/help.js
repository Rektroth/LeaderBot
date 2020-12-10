module.exports = {
    name: "help",
    description: "Gets the world record of a given category in a given game.",
    execute: function(msg) {
        const discord = require("discord.js");
        const formatting = require("../formatting.js");
        var channelId = msg.channel.id;

        msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("LeaderBot Help")
                .setDescription("Commands:\n"
                              + "    !help\n"
                              + "    !levelpb\n"
                              + "    !levelwr\n"
                              + "    !pb\n"
                              + "    !source\n"
                              + "    !wr\n"));
        console.log(`Sent help message to channel ${channelId}.`);
    }
}