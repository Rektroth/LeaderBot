const discord = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new discord.Client();

const help = require("./commands/help");
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
    if (msg.content.startsWith("!help")) {
		help(msg);
	} else if (msg.content.startsWith("!pb")) {
		let args = msg.content.substring(4).split(";");
		pb(msg, args);
	} else if (msg.content.startsWith("!source")) {
		source(msg);
	} else if (msg.content.startsWith("!wr")) {
		let args = msg.content.substring(4).split(";");
		wr(msg, args);
	}
});