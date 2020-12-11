module.exports = {
    name: "pb",
    description: "Gets a given player's personal best in a given category in a given game.",
    execute: async function(msg, args) {
        const discord = require("discord.js");
        const fetch = require("node-fetch");
        const formatting = require("../formatting.js");
        const channelId = msg.channel.id;

        if (args.length >= 3) {
            let player = args[0];
            let game = args[1];
            let category = args[2];
            let respPlayerData = await fetch(`https://www.speedrun.com/api/v1/users?name=${player}`);
            let playerData = await respPlayerData.json();

            if (playerData.data.length != 0 && playerData.data[0].name == player) {
                let respPbsData = await fetch(playerData.data[0].links[3].uri + "?embed=game,category");
                let pbsData = await respPbsData.json();
                
                if (pbsData.data.length != 0) {
                    for (let i = 0; i < pbsData.data.length; i++) {
                        let gameName = pbsData.data[i].game.data.names["international"];
                        let categoryName = pbsData.data[i].category.data.name;
                        let categoryType = pbsData.data[i].category.data.type;
        
                        if (gameName == game && categoryName == category && categoryType == "per-game") {
                            let pbTime = FormatTime(pbsData.data[i].run.times.primary_t);
                            let pbDate = FormatDate(pbsData.data[i].run.date);
                            let pbLink = pbsData.data[i].run.weblink;

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
    }
};