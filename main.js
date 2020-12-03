const jsdom = require("jsdom");
const discord = require("discord.js");
const fs = require('fs');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM("")).window;
global.document = document;
const $ = jQuery = require("jquery")(window);

const client = new discord.Client();

const EMBED_COLOR = "#0F7A4D";

login = "";

try {
	let rawSettingsData = fs.readFileSync("settings.json");

	try {
		let settings = JSON.parse(rawSettingsData);
		login = settings['login'];
	} catch (err) {
		console.log("There was a problem reading your 'settings.json' file.");
		process.exit();
	}
} catch (err) {
	fs.writeFileSync("settings.json", '{ "login": YOUR_LOGIN_KEY }');
	console.log("A 'settings.json' file has been created.");
	process.exit();
}

const helpEmbed = new discord.MessageEmbed()
	.setColor(EMBED_COLOR)
	.setTitle("LeaderBot Help")
	.addFields(
		{ name: "Queries", value: "!wr\n!pb" }
	);

const helpWrEmbed = new discord.MessageEmbed()
	.setColor(EMBED_COLOR)
	.setTitle("!wr Command Help")
	.setDescription("Usage:\n    !wr game_name;category_name\n\nRetrieves the world record run for a specified game category.");

const helpPbEmbed = new discord.MessageEmbed()
	.setColor(EMBED_COLOR)
	.setTitle("!pb Command Help")
	.setDescription("Usage:\n    !pb user_name;game_name;category_name\n\nRetrives a specified user's personal best run for a specified game category.");

client.login(login);

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", msg => {
    var channel = msg.channel;
	
	if (msg.content === "!help"){
		channel.send(helpEmbed);
	}
	
	if (msg.content.startsWith("!wr ")) {
		var res = msg.content.substring(4);
		var args = res.split(";");
		
		if (args.length == 2) {
			var gameName = args[0];
			var gameId = "000";
			var categoryName = args[1];
			var categoryId = "000";
			var playerId = "000";
			
			$.getJSON("https://www.speedrun.com/api/v1/games?name=" + gameName, function(data1) {
				if (data1.data.length != 0){
					gameId = data1.data[0].id;
					
					$.getJSON("https://www.speedrun.com/api/v1/games/" + gameId + "/categories", function(data2) {
						if (data2.data.length != 0){
							for (var i = 0; i < data2.data.length; i++) {
								if (data2.data[i].name === categoryName) {
									categoryId = data2.data[i].id;
									break;
								}
							}
							
							if (categoryId != "000") {
								$.getJSON("https://www.speedrun.com/api/v1/leaderboards/" + gameId + "/category/" + categoryId, function(data3) {
									if (data3.data.runs.length != 0) {
										$.getJSON(data3.data.runs[0].run.players[0].uri, function(data4) {
											var wrTime = formatTime(data3.data.runs[0].run.times.primary_t);
											var wrHolder = data4.data.names.international;
											var wrDate = formatDate(data3.data.runs[0].run.date);
											var wrLink = data3.data.runs[0].run.weblink;
											
											channel.send(new discord.MessageEmbed()
												.setColor(EMBED_COLOR)
												.setTitle("World Record Run")
												.setDescription("The current world record in " + gameName + " - " + categoryName + " is " + wrTime + " by " + wrHolder + ", set on " + wrDate + ".\n" + wrLink)
											);
											console.log("Sent world record for " + gameName + " - " + categoryName + " to channel " + channel.id + ".");
										});
									}
									else {
										channel.send(new discord.MessageEmbed()
											.setColor(EMBED_COLOR)
											.setTitle("Error")
											.setDescription("That category has no runs.")
										);
									}
								});
							}
							else {
								channel.send(new discord.MessageEmbed()
									.setColor(EMBED_COLOR)
									.setTitle("Error")
									.setDescription("No category with that name was found.")
								);
							}
						}
						else{
							channel.send(new discord.MessageEmbed()
								.setColor(EMBED_COLOR)
								.setTitle("LeaderBoard Error")
								.setDescription("No category with that name was found.")
							);
						}
					});
				}
				else {
					channel.send(new discord.MessageEmbed()
						.setColor(EMBED_COLOR)
						.setTitle("Leaderboard Error")
						.setDescription("No game with that name was found.")
					);
				}
			});
		}
		else {
			channel.send(helpWrEmbed);
		}
	}
	else if (msg.content === "!wr") {
		channel.send(helpWrEmbed);
	}
	
	if (msg.content.startsWith("!pb ")) {
		channel.send(new discord.MessageEmbed()
			.setColor(EMBED_COLOR)
			.setTitle("Command Notification")
			.setDescription("That command has not been fully implemented yet. Please check back later.")
		);
	}
});

function formatTime(time) {
	if (time > 3600) {
		var h = Math.floor(time / 3600);
		var m = Math.floor(time / 60) - (h * 60);
		var s = time % 60;
		
		var minutes;
		var seconds;
		
		if (m < 10) {
			minutes = "0" + m;
		}
		else {
			minutes = m;
		}
		
		if (s < 10) {
			seconds = "0" + s;
		}
		else {
			seconds = s;
		}
		
		return h + ":" + minutes + ":" + seconds;
	}
	else if (time > 60) {
		var m = Math.floor(time / 60);
		var s = time % 60;
		
		if (s < 10) {
			return m + ":0" + s;
		}
		else {
			return m + ":" + s;
		}
	}
	else {
		return time + "s";
	}
}

function formatDate(date) {
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
	
	if (d % 10 == 1) {
		day = d + "st";
	}
	else if (d % 10 == 2) {
		day = d + "nd";
	}
	else if (d % 10 == 3) {
		day = d + "rd";
	}
	else {
		day = d + "th";
	}
	
	return month + " " + day + ", " + y;
}