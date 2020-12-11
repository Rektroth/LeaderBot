module.exports = {
    name: "wr",
    description: "Gets the world record of a given category in a given game.",
    execute: async function(msg, args) {
        const discord = require("discord.js");
        const fetch = require("node-fetch");
        const formatting = require("../formatting.js");
        const channelId = msg.channel.id;

        if (args.length >= 2) {
            let game = args[0];
            let category = args[1];
            let respGamesData = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}`);
            let gamesData = await respGamesData.json();

            if (gamesData.data.length != 0 && gamesData.data[0].names["international"] == game) {
                let respCatData = await fetch(gamesData.data[0].links[3].uri);
                let catData = await respCatData.json();
                
                if (catData.data.length != 0) {
                    for (let i = 0; i < catData.data.length; i++) {
                        if (catData.data[i].name == category) {
                            let respRecData = await fetch(catData.data[i].links[3].uri);
                            let recData = await respRecData.json();

                            if (recData.data[0].runs.length != 0) {
                                let respPlayerData = await fetch(recData.data[0].runs[0].run.players[0].uri);
                                let playerData = await respPlayerData.json();
                                let wrTime = formatting.formatTime(recData.data[0].runs[0].run.times.primary_t);
                                let wrHolder = playerData.data.names.international;
                                let wrDate = formatting.formatDate(recData.data[0].runs[0].run.date);
                                let wrLink = recData.data[0].runs[0].run.weblink;

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

                        if (i == catData.data.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Category Not Found")
                                .setDescription(`The category "${category}" was not found.`));
                            console.log(`The category "${category}" was not found.`);
                        }
                    }
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("Category Not Found")
                        .setDescription(`The category "${category}" was not found.`));
                    console.log(`The category "${category}" was not found.`);
                }
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("Game Not Found")
                    .setDescription(`The game "${game}" was not found.`));
                console.log(`The game "${game}" was not found.`);
            }

            console.log(`Sent the world record for "${game} - ${category}" to channel ${channelId}.`);
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("!wr Command Help")
                .setDescription("Usage:\n"
                              + "    !wr game_name;category_name\n\n"
                              + "Gets the world record of a given category in a given game."));
            console.log(`Sent wr help message to channel ${channelId}.`);
        }
    }
};