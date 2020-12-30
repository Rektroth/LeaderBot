const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    if (args.length == 1) {
        var game = args[0];

        let games = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}&embed=categories`);
        games = await games.json();
        games = games.data;

        if (games.length != 0 && games[0].names["international"] == game) {
            let categories = games[0].categories.data;
            let gameCategories = "";
            let levelCategories = "";

            if (categories.length != 0) {
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].type == "per-game") {
                        if (gameCategories.length != "") {
                            gameCategories += "\n";
                        }

                        gameCategories += `${categories[i].name}`;
                    } else {
                        if (levelCategories.length != "") {
                            levelCategories += "\n";
                        }

                        levelCategories += `${categories[i].name}`;
                    }
                }

                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("Game Categories")
                    .setDescription("**Per-Game Categories:**\n"
                                  + `${gameCategories}\n\n`
                                  + "**Per-Level Categories:**\n"
                                  + `${levelCategories}`));
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("No Categories")
                    .setDescription(`${game} currently has no categories.`));
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
            .setTitle("!categories Command Help")
            .setDescription("`!categories game\n"
                          + "Gets the categories in `game`."));
    }
};