const discord = require("discord.js");
const formatting = require("./formatting");
const fs = require("fs");
const path = require("path");

const client = new discord.Client();

const categories = require("./commands/categories");
const help = require("./commands/help");
const levels = require("./commands/levels");
const pb = require("./commands/pb");
const source = require("./commands/source");
const wr = require("./commands/wr");

try {
	let rawSettingsData = fs.readFileSync("settings.json");

	try {
		var settings = JSON.parse(rawSettingsData);
		var login = settings["login"];
	} catch (err) {
		console.log('There was a problem reading your "settings.json" file.');
		process.exit(-1);
	}
} catch (err) {
	fs.writeFileSync("settings.json", '{ "login": YOUR_LOGIN_KEY }');
	console.log('A "settings.json" file has been created.');
	process.exit(-1);
}

client.login(login);

client.on("ready", () => {
    console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", msg => {
	if (msg.content.startsWith("!categories")) {
		if (msg.content == "!categories") {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!categories Command Help")
				.setDescription("`!categories game\n"
							  + "Gets the categories in `game`."));
		} else if (msg.content.startsWith("!categories ")) {
			let args = msg.content.substring(12).split(";");
			categories(msg, args);
		}
	}
	if (msg.content.startsWith("!help")) {
		if (msg.content.startsWith("!help ")) {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!help Command Help")
				.setDescription("`!help\n"
							  + "Displays the help message."));
		} else if (msg.content == "!help") {
			help(msg);
		}
	} else if (msg.content.startsWith("!levels")) {
		if (msg.content == "!levels") {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!levels Command Help")
				.setDescription("`!levels game\n"
							  + "Gets the levels of `game`."));
		} else if (msg.content.startsWith("!levels ")) {
			let args = msg.content.substring(8).split(";");
			levels(msg, args);
		}
	} else if (msg.content.startsWith("!pb")) {
		if (msg.content == "!pb") {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!pb Command Help")
				.setDescription("`!pb player;game;category`\n"
							  + "Gets `player`'s personal best in `category` in `game`.\n\n"
							  + "`!pb player;game;level;category`\n"
							  + "Gets `player`'s personal best in `category` in `level` of `game`."));
		} else if (msg.content.startsWith("!pb ")) {
			let args = msg.content.substring(4).split(";");
			pb(msg, args);
		}
	} else if (msg.content.startsWith("!source")) {
		if (msg.content.startsWith("!source ")) {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!source Command Help")
				.setDescription("`!source`\n"
							  + "Provides a link to my source code."));
		} else if (msg.content == "!source") {
			source(msg);
		}
	} else if (msg.content.startsWith("!wr")) {
		if (msg.content == "!wr") {
			msg.reply(new discord.MessageEmbed()
				.setColor(formatting.messageColor)
				.setTitle("!wr Command Help")
				.setDescription("`!wr game;category`\n"
							  + "Gets the world record of `category` in `game`.\n\n"
							  + "`!wr game;level;category`\n"
							  + "Gets the world record of `category` in `level` of `game`."));
		} else if (msg.content.startsWith("!wr ")) {
			let args = msg.content.substring(4).split(";");
			wr(msg, args);
		}
	}
});