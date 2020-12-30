const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    if (args.length == 1) {
        var game = args[0];

        let games = await fetch(`https://www.speedrun.com/api/v1/games?name=${game}&embed=levels`);
        games = await games.json();
        games = games.data;

        if (games.length != 0 && games[0].names["international"] == game) {
            let levels = games[0].levels.data;
            let levelNames = "";

            if (levels.length != 0) {
                for (let i = 0; i < levels.length; i++) {
                    if (levelNames.length != "") {
                        levelNames += "\n";
                    }

                    levelNames += `${levels[i].name}`;
                }

                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("Game Levels")
                    .setDescription(levelNames));
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("No Levels")
                    .setDescription(`${game} currently has no levels.`));
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
            .setTitle("!levels Command Help")
            .setDescription("`!levels game`\n"
                          + "Gets the levels of `game`."));
    }
};