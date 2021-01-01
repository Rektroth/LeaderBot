const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    if (args.length >= 2 && args.length <= 3) {
        var game = args[0];

        if (args.length == 2) {
            var category = args[1];
        } else {
            var level = args[1];
            var category = args[2];
        }

        let games = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}&embed=categories,levels`);
        games = await games.json();
        games = games.data;

        if (games.length != 0 && games[0].names["international"] == game) {
            let categories = games[0].categories.data;
            let levels = games[0].levels.data;

            if (args.length == 3) {
                if (levels.length != 0) {
                    for (let i = 0; i < levels.length; i++) {
                        if (levels[i].name == level) {
                            categories = await fetch(levels[i].links[2].uri);
                            categories = await categories.json();
                            categories = categories.data;
                            break;
                        } else if (i == levels.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Level Not Found")
                                .setDescription(`The level "${level}" was not found.`));
                            return;
                        }
                    }
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("Level Not Found")
                        .setDescription(`The level "${level}" was not found.`));
                    return;
                }
            }

            if (categories.length != 0) {
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].name == category) {
                        let records = await fetch(`${categories[i].links[3].uri}?embed=level`);
                        records = await records.json();
                        records = records.data;

                        // if a level has been specified, get the records for the specific level
                        if (args.length == 3) {
                            for (let j = 0; j < records.length; j++) {
                                if (records[j].level.data.name == level) {
                                    records = records[j];
                                    break;
                                } else if (j == records.length - 1) {
                                    msg.reply(new discord.MessageEmbed()
                                        .setColor(formatting.messageColor)
                                        .setTitle("Records Not Found")
                                        .setDescription("The level and category were both found, but records for the combination were not.\n"
                                                        + "This shouldn't happen.\n"
                                                        + "Please report this at https://github.com/Rektroth/LeaderBot/issues with the specific game, level, and category."));
                                    return;
                                }
                            }
                        } else {
                            records = records[0];
                        }

                        if (records.runs.length != 0) {
                            let run = records.runs[0].run;
                            let player = await fetch(run.players[0].uri);
                            player = await player.json();
                            player = player.data;

                            let wrTime = formatting.formatTime(run.times.primary_t);
                            let wrHolder = player.names["international"];
                            let wrDate = formatting.formatDate(run.date);
                            let wrLink = run.weblink;

                            if (args.length == 2) {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle(`${game} - ${category} World Record`)
                                    .setDescription(`The current world record in ${game} - ${category} `
                                                + `is ${wrTime} by ${wrHolder}, set on ${wrDate}\n`
                                                + wrLink));
                            } else {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle(`${game} - ${level}: ${category} World Record`)
                                    .setDescription(`The current world record in ${game} - ${level}: ${category} `
                                                + `is ${wrTime} by ${wrHolder}, set on ${wrDate}\n`
                                                + wrLink));
                            }
                        } else {
                            if (args.length == 2) {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle(`${game} - ${category} World Record`)
                                    .setDescription(`There is currently on world record in ${game} - ${category}.`));
                            } else {
                                msg.reply(new discord.MessageEmbed()
                                    .setColor(formatting.messageColor)
                                    .setTitle(`${game} - ${level}: ${category} World Record`)
                                    .setDescription(`There is currently on world record in ${game} - ${level}: ${category}.`));
                            }
                        }

                        return;
                    } else if (i == categories.length - 1) {
                        msg.reply(new discord.MessageEmbed()
                            .setColor(formatting.messageColor)
                            .setTitle(`"${category}" Not Found`)
                            .setDescription(`The category "${category}" was not found.`));
                    }
                }
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle(`"${category}" Not Found`)
                    .setDescription(`The category "${category}" was not found.`));
            }
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle(`"${game}" Not Found`)
                .setDescription(`The game "${game}" was not found.`));
        }
    } else {
        msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("!wr Command Help")
            .setDescription("`!wr game;category`\n"
                          + "Gets the world record of `category` in `game`.\n\n"
                          + "`!wr game;level;category`\n"
                          + "Gets the world record of `category` in `level` of `game`."));
    }
};