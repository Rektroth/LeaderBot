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

            if (args.length == 2) {
                if (categories.length != 0) {
                    for (let i = 0; i < categories.length; i++) {
                        if (categories[i].name == category && categories[i].type == "per-game") {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle(`${game} - ${category} Rules`)
                                .setDescription(categories[i].rules));
                            return;
                        }
                        
                        if (i == categories.length - 1) {
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
                let levels = games[0].levels.data;
                let rules = "";

                if (categories.length != 0) {
                    for (let i = 0; i < categories.length; i++) {
                        if (categories[i].name == category && categories[i].type == "per-level") {
                            rules += categories[i].rules;
                            break;
                        }
                        
                        if (i == categories.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle(`"${category}" Not Found`)
                                .setDescription(`The category "${category}" was not found.`));
                            return;
                        }
                    }
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle(`"${category}" Not Found`)
                        .setDescription(`The category "${category}" was not found.`));
                    return;
                }

                if (levels.length != 0) {
                    for (let i = 0; i < levels.length; i++) {
                        if (levels[i].name == level) {
                            if (levels[i].rules != null) {
                                rules += `\n\n${rules[i].rules}`;
                            }

                            break;
                        }

                        if (i == levels.length - 1) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle(`"${level}" Not Found`)
                                .setDescription(`The level "${level}" was not found.`));
                            return;
                        }
                    }
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle(`"${level}" Not Found`)
                        .setDescription(`The level "${level}" was not found.`));
                    return;
                }

                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle(`${game} - ${level}: ${category} Rules`)
                    .setDescription(rules));
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
            .setTitle("!rules Command Help")
            .setDescription("`!rules game;category`\n"
                          + "Gets the rules for `category` in `game`.\n\n"
                          + "`!rules game;level;category`\n"
                          + "Gets the rules for `category` in `level` of `game`."));
    }
};