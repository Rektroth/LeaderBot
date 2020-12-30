const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    if (args.length >= 3 && args.length <= 4) {
        var player = args[0];
        var game = args[1];

        if (args.length == 3) {
            var category = args[2];
        } else {
            var level = args[2];
            var category = args[3];
        }

        let players = await fetch(`https://www.speedrun.com/api/v1/users?name=${player}`);
        players = await players.json();
        players = players.data;

        if (players.length != 0 && players[0].names["international"] == player) {
            let personalBests = await fetch(`${players[0].links[3].uri}?embed=game,category,level`);
            personalBests = await personalBests.json();
            personalBests = personalBests.data;

            if (personalBests.length != 0) {
                for (let i = 0; i < personalBests.length; i++) {
                    let run = personalBests[i].run;
                    let gameName = personalBests[i].game.data.names["international"];
                    let categoryName = personalBests[i].category.data.name;

                    if (args.length == 3) {
                        let categoryType = personalBests[i].category.data.type;
                        
                        if (gameName == game && categoryName == category && categoryType == "per-game") {
                            let pbTime = formatting.formatTime(run.times["primary_t"]);
                            let pbDate = formatting.formatDate(run.date);
                            let pbLink = run.weblink;
                            
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Personal Best Run")
                                .setDescription(`${player}'s current personal best in ${game} - ${category} `
                                              + `is ${pbTime}, set on ${pbDate}.\n`
                                              + pbLink));
                            return;
                        }
                    } else if (personalBests[i].level.data.hasOwnProperty("name")) {
                        let levelName = personalBests[i].level.data.name;

                        if (gameName == game && categoryName == category && levelName == level) {
                            let pbTime = formatting.formatTime(run.times["primary_t"]);
                            let pbDate = formatting.formatDate(run.date);
                            let pbLink = run.weblink;
                            
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("Personal Best Run")
                                .setDescription(`${player}'s current personal best in ${game} - ${level}: ${category} `
                                              + `is ${pbTime}, set on ${pbDate}.\n`
                                              + pbLink));
                            return;
                        }
                    }
                    
                    if (i == personalBests.length - 1) {
                        if (args.length == 3) {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("No Personal Best")
                                .setDescription(`${player} currently has no personal best in ${game} - ${category}.`));
                        } else {
                            msg.reply(new discord.MessageEmbed()
                                .setColor(formatting.messageColor)
                                .setTitle("No Personal Best")
                                .setDescription(`${player} currently has no personal best in ${game} - ${level}: ${category}.`));
                        }
                    }
                }
            } else {
                if (args.length == 3) {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("No Personal Best")
                        .setDescription(`${player}" currently has no personal best in ${game} - ${category}.`));
                } else {
                    msg.reply(new discord.MessageEmbed()
                        .setColor(formatting.messageColor)
                        .setTitle("No Personal Best")
                        .setDescription(`${player}" currently has no personal best in ${game} - ${level}: ${category}.`));
                }
            }
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("Player Not Found")
                .setDescription(`The player "${player}" was not found.`));
        }
    } else {
        msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("!pb Command Help")
            .setDescription("`!pb player;game;category`\n"
                          + "Gets `player`'s personal best in `category` in `game`.\n\n"
                          + "`!pb player;game;level;category`\n"
                          + "Gets `player`'s personal best in `category` in `level` of `game`."));
    }
};