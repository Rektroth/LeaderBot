const discord = require("discord.js");
const fs = require("fs");

const client = new discord.Client();

const commandPath = path.join(__dirname, "/commands");
const commandFiles = Fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (var file of commandFiles)
{
	var command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

var settings;
var login;

try {
	let rawSettingsData = fs.readFileSync("settings.json");

	try {
		settings = JSON.parse(rawSettingsData);
		login = settings["login"];
	} catch (err) {
		console.log('There was a problem reading your "settings.json" file.');
		process.exit();
	}
} catch (err) {
	fs.writeFileSync("settings.json", '{ "login": YOUR_LOGIN_KEY }');
	console.log('A "settings.json" file has been created.');
	process.exit();
}

client.login(login);

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", msg => {
    if (msg.content.startsWith("!help")) {
		commands.get("help").execute(msg);
	} else if (msg.content.startsWith("!source")) {
		commands.get("source").execute(msg);
	} else if (msg.content.startsWith("!wr")) {
		let res = msg.content.substring(4);
		let args = res.split(";");

		commands.get("wr").execute(msg, args);
	}
});

/*
function SendLevelWrMessage(channel, game, level, category)
{
	var wrTime;
	var wrHolder;
	var wrDate;
	var wrLink;

	$.getJSON("https://www.speedrun.com/api/v1/games?name=" + game + "&embed=levels", function(gamesData)
	{
		if (gamesData.data.length != 0 && gamesData.data[0].names["international"] == game)
		{
			if (gamesData.data[0].levels.data.length != 0)
			{
				for (let i = 0; i < gamesData.data[0].levels.data.length; i++)
				{
					if (gamesData.data[0].levels.data[i].name == level)
					{
						$.getJSON(gamesData.data[0].levels.data[i].links[2].uri, function(categoriesData)
						{
							if (categoriesData.data.length != 0)
							{
								for (let j = 0; j < categoriesData.data.length; j++)
								{
									if (categoriesData.data[j].name == category)
									{
										$.getJSON(categoriesData.data[j].links[3].uri + "?embed=players", function(recordsData)
										{
											if (recordsData.data[0].runs.length != 0)
											{
												$.getJSON(recordsData.data[0].runs[0].run.players[0].uri, function(playerData)
												{
													wrTime = FormatTime(recordsData.data[0].runs[0].run.times.primary_t);
														wrHolder = playerData.data.names.international;
														wrDate = FormatDate(recordsData.data[0].runs[0].run.date);
														wrLink = recordsData.data[0].runs[0].run.weblink;

														let description = "The current world record in " + game + " - " + level + ": " + category;
														description += " is " + wrTime;
														description += " by " + wrHolder;
														description += ", set on " + wrDate + ".";
														description += "\n" + wrLink;

														channel.send(new discord.MessageEmbed()
															.setColor(MESSAGE_COLOR)
															.setTitle("World Record Run")
															.setDescription(description)
														);
													});
												}
												else
												{
													channel.send(new discord.MessageEmbed()
														.setColor(MESSAGE_COLOR)
														.setTitle("No World Record")
														.setDescription("The '" + category + "' category currently has no world record.")
													);
												}
											});

											break;
										}

										if (j == categoriesData.data.length - 1)
										{
											SendCategoryNotFoundMessage(channel, category);
										}
									}
								}
								else
								{
									SendCategoryNotFoundMessage(channel, category);
								}
							});

							break;
						}

						if (i == levelsData.data.length - 1)
						{
							SendLevelNotFoundMessage(channel, level);
						}
					}
				}
				else
				{
					SendLevelNotFoundMessage(channel, level);
				}
			});
		}
		else
		{
			SendGameNotFoundMessage(channel, game);
		}
	});

	console.log('Sent the world record for "' + game + " - " + level + ": " + category + '" to channel ' + channel.id + ".");
}

function SendPbMessage(channel, player, game, category)
{
	var pbTime;
	var pbDate;
	var pbLink;

	$.getJSON("https://www.speedrun.com/api/v1/users?name=" + player, function(playerData)
	{
		if (playerData.data.length != 0)
		{
			$.getJSON(playerData.data[0].links[3].uri + "?embed=game,category", function(pbsData)
			{
				if (pbsData.data.length != 0)
				{
					for (let i = 0; i < pbsData.data.length; i++)
					{
						let gameName = pbsData.data[i].game.data.names["international"];
						let categoryName = pbsData.data[i].category.data.name;
						let categoryType = pbsData.data[i].category.data.type;

						if (gameName == game && categoryName == category && categoryType == "per-game")
						{
							pbTime = FormatTime(pbsData.data[i].run.times.primary_t);
							pbDate = FormatDate(pbsData.data[i].run.date);
							pbLink = pbsData.data[i].run.weblink;

							let description = player + "'s personal best in " + game + " - " + category;
							description += " is " + pbTime;
							description += ", set on " + pbDate + ".";
							description += "\n" + pbLink;

							channel.send(new discord.MessageEmbed()
								.setColor(MESSAGE_COLOR)
								.setTitle("Personal Best Run")
								.setDescription(description)
							);

							break;
						}

						if (i == pbsData.data.length - 1)
						{
							let description = "Either " + player;
							description += " currently has no personal best in the '" + category + "' category,";
							description += " or the game/category does not exist.";

							channel.send(new discord.MessageEmbed()
								.setColor(MESSAGE_COLOR)
								.setTitle("No Personal Best")
								.setDescription(description)
							);
						}
					}
				}
				else
				{
					let description = "Either " + player;
					description += " currently has no personal best in the '" + category + "' category,";
					description += " or the game/category does not exist.";

					channel.send(new discord.MessageEmbed()
						.setColor(MESSAGE_COLOR)
						.setTitle("No Personal Best")
						.setDescription(description)
					);
				}
			});
		}
		else
		{
			SendPlayerNotFoundMessage(player);
		}
	});

	console.log("Sent the personal best for " + player + ' in "' + game + " - " + category + '" to channel ' + channel.id + ".");
}
*/