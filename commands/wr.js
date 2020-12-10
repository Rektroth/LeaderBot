module.exports = {
    name: "wr",
    description: "Gets the world record of a given category in a given game.",
    execute: async function(msg, args) {
        const discord = require("discord.js");
        const formatting = require("../formatting.js");

        if (args.length >= 2) {
            var game = args[0];
            var category = args[1];
            var channelId = msg.channel.id;

            var wrTime;
            var wrHolder;
            var wrDate;
            var wrLink;

            var respGamesData = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}`);
            var gamesData = respGamesData.json();

            if (gamesData.data[0].names["international"] == game) {
                var respCatData = await fetch(gamesData.data[0].links[3].uri);
                var catData = respCatData.json();
                
                if (catData.data.length != 0) {
                    for (let i = 0; i < catData.data.length; i++) {
                        if (categoriesData.data[i].name == category) {
                            var respRecData = await fetch(catData.data[i].links[3].uri);
                            var recData = respRecData.json();

                            if (recordsData.data[0].runs.length != 0) {
                                var respPlayerData = await fetch(recData.data[0].runs[0].run.players[0].uri);
                                var playerData = respPlayerData.json();

                                wrTime = formatting.formatTime(recordsData.data[0].runs[0].run.times.primary_t);
                                wrHolder = playerData.data.names.international;
                                wrDate = formatting.formatDate(recordsData.data[0].runs[0].run.date);
                                wrLink = recordsData.data[0].runs[0].run.weblink;

                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("World Record Run")
                                    .setDescription(`The current world record in ${game} - ${category} `
                                                  + `is ${wrTime} by ${wrHolder}, set on ${wrDate}\n`
                                                  + wrLink));
                            } else {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("No World Record")
                                    .setDescription(`The "${category}" category currently has no world record.`));
                            }

                            break;
                        }

                        if (i == categoriesData.data.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Category Not Found")
                                .setDescription(`No category named "${category}" was found.`));
                            console.log(`Category "${category}" was not found.`);
                        }
                    }
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("Category Not Found")
                        .setDescription(`No category named "${category}" was found.`));
                    console.log(`Category "${category}" was not found.`);
                }
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("Game Not Found")
                    .setDescription(`No game named "${game}" was found.`));
                console.log(`No game named "${game}" was found.`);
            }

            console.log(`Sent the world record for "${game} - ${category}" to channel ${channelId}.`);
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("!wr Command Help")
                .setDescription("Usage:\n"
                              + "    !wr game_name;category_name\n\n"
                              + "Retrieves the world record run for a specified game category."));
            console.log(`Sent wr help message to channel ${channelId}.`);
        }
    }
};