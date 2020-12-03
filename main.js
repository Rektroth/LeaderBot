const jsdom = require("jsdom");
const discord = require("discord.js");
const fs = require("fs");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM("")).window;
global.document = document;
const $ = jQuery = require("jquery")(window);

const Client = new discord.Client();

const MESSAGE_COLOR = "#0F7A4D";

var Settings;
var Login;

function Main()
{
	try
	{
		let rawSettingsData = fs.readFileSync("settings.json");

		try
		{
			Settings = JSON.parse(rawSettingsData);
			Login = Settings["login"];
		}
		catch (err)
		{
			console.log('There was a problem reading your "settings.json" file.');
			process.exit();
		}
	}
	catch (err)
	{
		fs.writeFileSync("settings.json", '{ "login": YOUR_LOGIN_KEY }');
		console.log('A "settings.json" file has been created.');
		process.exit();
	}

	Client.login(Login);
}

Client.on("ready", () =>
{
    console.log("Logged in as " + Client.user.tag + "!");
});

Client.on("message", msg =>
{
    var channel = msg.channel;
	
	if (msg.content.startsWith("!help"))
	{
		SendHelpMessage(channel);
	}
	else if (msg.content.startsWith("!wr"))
	{
		if (msg.content == "!wr")
		{
			SendHelpWrMessage(channel);
		}
		else if (msg.content.startsWith("!wr "))
		{
			let res = msg.content.substring(4);
			let args = res.split(";");

			if (args.length == 2)
			{
				SendWrMessage(channel, args[0], args[1]);
			}
			else
			{
				SendHelpWrMessage(channel);
			}
		}
	}
	else if (msg.content.startsWith("!pb"))
	{
		if (msg.content == "!pb")
		{
			SendHelpPbMessage(channel);
		}
		else if (msg.content.startsWith("!pb "))
		{
			let res = msg.content.substring(4);
			let args = res.split(";");

			if (args.length == 3)
			{
				SendPbMessage(channel, args[0], args[1], args[2]);
			}
			else
			{
				SendHelpPbMessage(channel);
			}
		}
	}
	else if (msg.content == "!source")
	{
		SendSourceMessage(channel);
	}
});

function PlayerNotFoundMessage(player)
{
	return new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("Player Not Found")
		.setDescription('No player named "' + player + '" was found.');
}

function GameNotFoundMessage(game)
{
	return new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("Game Not Found")
		.setDescription('No game named "' + game + '" was found.');
}

function CategoryNotFoundMessage(category)
{
	return new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("Leaderboard Not Found")
		.setDescription('No category named "' + category + '" was found.');
}

function SendHelpMessage(channel)
{
	channel.send(new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("LeaderBot Help")
		.addFields(
			{ name: "Queries", value: "!help\n!pb\n!source\n!wr" }
		)
	);

	console.log("Sent help message to channel " + channel.id + ".");
}

function SendHelpPbMessage(channel)
{
	channel.send(new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("!pb Command Help")
		.setDescription("Usage:\n    !pb user_name;game_name;category_name\n\nRetrives a specified user's personal best run for a specified game category.")
	);

	console.log("Sent pb help message to channel " + channel.id + ".");
}

function SendHelpWrMessage(channel)
{
	channel.send(new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("!wr Command Help")
		.setDescription("Usage:\n    !wr game_name;category_name\n\nRetrieves the world record run for a specified game category.")
	);

	console.log("Sent wr help message to channel " + channel.id + ".");
}

function SendSourceMessage(channel)
{
	channel.send(new discord.MessageEmbed()
		.setColor(MESSAGE_COLOR)
		.setTitle("Source Code")
		.setDescription("My source code is available at:\nhttps://github.com/Rektroth/LeaderBot")
	);

	console.log("Sent source code info to channel " + channel.id + ".");
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
			channel.send(PlayerNotFoundMessage(player));
		}
	});

	console.log("Sent the personal best for " + player + ' in "' + game + " - " + category + '" to channel ' + channel.id + ".");
}

function SendWrMessage(channel, game, category)
{
	var wrTime;
	var wrHolder;
	var wrDate;
	var wrLink;

	$.getJSON("https://www.speedrun.com/api/v1/games?name=" + game, function(gamesData)
	{
		if (gamesData.data.length != 0)
		{
			$.getJSON(gamesData.data[0].links[3].uri, function(categoriesData)
			{
				if (categoriesData.data.length != 0)
				{
					for (let i = 0; i < categoriesData.data.length; i++)
					{
						if (categoriesData.data[i].name == category)
						{
							$.getJSON(categoriesData.data[i].links[3].uri, function(recordsData)
							{
								if (recordsData.data[0].runs.length != 0)
								{
									$.getJSON(recordsData.data[0].runs[0].run.players[0].uri, function(playerData)
									{
										wrTime = FormatTime(recordsData.data[0].runs[0].run.times.primary_t);
										wrHolder = playerData.data.names.international;
										wrDate = FormatDate(recordsData.data[0].runs[0].run.date);
										wrLink = recordsData.data[0].runs[0].run.weblink;

										let description = "The current world record in " + game + " - " + category;
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

						if (i == categoriesData.data.length - 1)
						{
							channel.send(CategoryNotFoundMessage(category));
						}
					}
				}
				else
				{
					channel.send(CategoryNotFoundMessage(category));
				}
			});
		}
		else
		{
			channel.send(GameNotFoundMessage(game));
		}
	});

	console.log('Sent the world record for "' + game + " - " + category + '" to channel ' + channel.id + ".");
}

function FormatTime(time)
{
	if (time > 3600)
	{
		var h = Math.floor(time / 3600);
		var m = Math.floor(time / 60) - (h * 60);
		var s = time % 60;
		
		var minutes;
		var seconds;
		
		if (m < 10)
		{
			minutes = "0" + m;
		}
		else
		{
			minutes = m;
		}
		
		if (s < 10)
		{
			seconds = "0" + s;
		}
		else
		{
			seconds = s;
		}
		
		return h + ":" + minutes + ":" + seconds;
	}
	else if (time > 60)
	{
		var m = Math.floor(time / 60);
		var s = time % 60;
		
		if (s < 10)
		{
			return m + ":0" + s;
		}
		else
		{
			return m + ":" + s;
		}
	}
	else
	{
		return time + "s";
	}
}

function FormatDate(date)
{
	var y = date.substring(0, 4);
	var m = date.substring(5, 7);
	var d = date.substring(8, 10);
	
	var month;
	var day;
	
	switch (m)
	{
		case "01":
			month = "January";
			break;
		case "02":
			month = "February";
			break;
		case "03":
			month = "March";
			break;
		case "04":
			month = "April";
			break;
		case "05":
			month = "May";
			break;
		case "06":
			month = "June";
			break;
		case "07":
			month = "July";
			break;
		case "08":
			month = "August";
			break;
		case "09":
			month = "September";
			break;
		case "10":
			month = "October";
			break;
		case "11":
			month = "November";
			break;
		default:
			month = "December";
			break;
	}
	
	if (d % 10 == 1)
	{
		day = d + "st";
	}
	else if (d % 10 == 2)
	{
		day = d + "nd";
	}
	else if (d % 10 == 3)
	{
		day = d + "rd";
	}
	else
	{
		day = d + "th";
	}
	
	return month + " " + day + ", " + y;
}

if (require.main === module)
{
	Main();
}