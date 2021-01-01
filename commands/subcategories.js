const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    if (args.length >= 2 && args.length <= 3) {
        var game = args[0];

        if (args.length == 2) {
            var category = args[1];
        } else {
            var category = args[2];
        }

        let games = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}`);
        games = await games.json();
        games = games.data;

        if (games.length != 0 && games[0].names["international"] == game) {
            let categories = await fetch(`${games[0].links[3].uri}?embed=variables`);
            categories = await categories.json();
            categories = categories.data;

            if (categories.length != 0) {
                for (let i = 0; i < categories.length; i++) {
                    if (categories[i].name == category && categories[i].type == "per-game") {
                        let variables = categories[i].variables.data;
                        let subcategories = "";

                        if (variables.length != 0) {
                            for (let j = 0; j < variables.length; j++) {
                                if (variables[j]["is-subcategory"]) {
                                    if (subcategories != "") {
                                        subcategories += "\n\n";
                                    }
                                    
                                    subcategories += `**${variables[j].name}**`;

                                    let values = variables[j].values.values;
                                    let keys = Object.keys(values);

                                    for (let k = 0; k < keys.length; k++) {
                                        let key = keys[k];
                                        subcategories += `\n${values[key].label}`
                                    }
                                }
                            }
                        }
                        
                        if (subcategories != "") {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle(`${game} - ${category} Subcategories`)
                                .setDescription(subcategories));
                        } else {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle(`${game} - ${category} Subcategories`)
                                .setDescription(`${game} - ${category} has no subcategories.`));
                        }

                        return;
                    }

                    if (i == categories.length - 1) {
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
            .setTitle("!subcategories Command Help")
            .setDescription("`!subcategories game;category`\n"
                          + "Gets the subcategories of `category` in `game`.\n\n"
                          + "`!subcategories game;level;category`\n"
                          + "Gets the subcategories of `category` in `level` of `game`."));
    }
};