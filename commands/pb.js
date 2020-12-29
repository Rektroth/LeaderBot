const discord = require("discord.js");
const fetch = require("node-fetch");
const formatting = require("../formatting");

module.exports = async function(msg, args) {
    var channelId = msg.channel.id;
    
    if (args.length >= 3) {
        var player = args[0];
        var game = args[1];
        var category = args[2];
        var respPlayerData = await fetch(`https://www.speedrun.com/api/v1/users?name=${player}`);
        var playerData = await respPlayerData.json();

        if (playerData.data.length != 0 && playerData.data[0].name == player) {
            var respPbsData = await fetch(playerData.data[0].links[3].uri + "?embed=game,category");
            var pbsData = await respPbsData.json();
                
            if (pbsData.data.length != 0) {
                for (let i = 0; i < pbsData.data.length; i++) {
                    var gameName = pbsData.data[i].game.data.names["international"];
                    var categoryName = pbsData.data[i].category.data.name;
                    var categoryType = pbsData.data[i].category.data.type;
        
                    if (gameName == game && categoryName == category && categoryType == "per-game") {
                        var pbTime = FormatTime(pbsData.data[i].run.times.primary_t);
                        var pbDate = FormatDate(pbsData.data[i].run.date);
                        var pbLink = pbsData.data[i].run.weblink;

                        msg.reply(new discord.MessageEmbed()
                            .setColor(formatting.messageColor)
                            .setTitle("Personal Best Run")
                            .setDescription(`${player}'s personal best in ${game} - ${category} `
                                          + `is ${pbTime}, set on ${pbDate}.\n`
                                          + pbLink));
                        break;
                    }
        
                    if (i == pbsData.data.length - 1){
                        msg.reply(new discord.MessageEmbed()
                            .setColor(formatting.messageColor)
                            .setTitle("No Personal Best")
                            .setDescription(`Either ${player} current has no personal best `
                                          + `in the "${category}" category or the `
                                          + `game/category does not exist.`));
                        console.log(`Either ${player} current has no personal best `
                                  + `in the "${category}" category or the `
                                  + `game/category does not exist.`);
                    }
                }
            } else {
                msg.reply(new discord.MessageEmbed()
                    .setColor(formatting.messageColor)
                    .setTitle("No Personal Best")
                    .setDescription(`Either ${player} current has no personal best `
                                  + `in the "${category}" category or the `
                                  + `game/category does not exist.`));
                console.log(`Either ${player} current has no personal best `
                          + `in the "${category}" category or the `
                          + `game/category does not exist.`);
            }
        } else {
            msg.reply(new discord.MessageEmbed()
                .setColor(formatting.messageColor)
                .setTitle("Player Not Found")
                .setDescription(`The player "${player}" was not found.`));
            console.log(`The player "${player}" was not found.`);
        }

        console.log(`Sent ${player}'s personal best for "${game} - ${category}" to channel ${channelId}.`);
    } else {
        msg.reply(new discord.MessageEmbed()
            .setColor(formatting.messageColor)
            .setTitle("!pb Command Help")
            .setDescription("Usage:\n"
                          + "    !pb player_name;game_name;category_name\n\n"
                          + "Gets a given player's personal best in a given category in a given game."));
        console.log(`Sent pb help message to channel ${channelId}.`);
    }
};