const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting.js");

module.exports = async function(msg, args) {
    if (args.length >= 2 && args.length <= 3) {
        var game = args[0];

        if (args.length == 2) {
            var category = args[1];
        } else {
            var level = args[1];
            var category = args[2];
        }

        let gamesData = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}&embed=categories,levels`);
        gamesData = await respGamesData.json();

        if (gamesData.data.length != 0 && gamesData.data[0].names["international"] == game) {
            let catData = gamesData.data[0].categories;
            let levData = gamesData.data[0].levels;

            if (args.length == 3) {
                if (levData.data.length != 0) {
                    for (let i = 0; i < levData.data.length; i++) {
                        if (levData.data[i].name == level) {
                            catData = await fetch(levData.data.links[2].uri);
                            break;
                        } else if (i == levData.data.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Level Not Found")
                                .setDescription(`The level "${level}" was not found.`));
                            return;
                        }
                    }

                    catData = await catData.json();
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("Level Not Found")
                        .setDescription(`The level "${level}" was not found.`));
                    return;
                }
            }
                
            if (catData.data.length != 0) {
                for (let i = 0; i < catData.data.length; i++) {
                    if (catData.data[i].name == category) {
                        let recData = await fetch(catData.data[i].links[3].uri);
                        recData = await respRecData.json();

                        if (recData.data[0].runs.length != 0) {
                            let respPlayerData = await fetch(recData.data[0].runs[0].run.players[0].uri);
                            let playerData = await respPlayerData.json();
                            let wrTime = formatting.formatTime(recData.data[0].runs[0].run.times.primary_t);
                            let wrHolder = playerData.data.names.international;
                            let wrDate = formatting.formatDate(recData.data[0].runs[0].run.date);
                            let wrLink = recData.data[0].runs[0].run.weblink;

                            if (args.length == 2) {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("World Record Run")
                                    .setDescription(`The current world record in ${game} - ${category} `
                                                + `is ${wrTime} by ${wrHolder}, set on ${wrDate}\n`
                                                + wrLink));
                            } else {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("World Record Run")
                                    .setDescription(`The current world record in ${game} - ${level}: ${category} `
                                                + `is ${wrTime} by ${wrHolder}, set on ${wrDate}\n`
                                                + wrLink));
                            }
                        } else {
                            if (args.length == 2) {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("No World Record")
                                    .setDescription(`The "${category}" category currently has no world record.`));
                            } else {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle("No World Record")
                                    .setDescription(`The "${level}: ${category}" category currently has no world record.`));
                            }
                        }

                        return;
                    } else  if (i == catData.data.length - 1) {
                        msg.reply(new discord.MessageEmbed()
                            .setColor(formatting.messageColor)
                            .setTitle("Category Not Found")
                            .setDescription(`The category "${category}" was not found.`));
                    }
                }
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("Category Not Found")
                    .setDescription(`The category "${category}" was not found.`));
            }
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("Game Not Found")
                .setDescription(`The game "${game}" was not found.`));
        }
    } else {
        msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("!wr Command Help")
            .setDescription("Usage:\n"
                          + "    !wr game_name;category_name\n\n"
                          + "Gets the world record of a given category in a given game."));
    }
};