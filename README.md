# LeaderBot

A Discord bot that uses the Speedrun.com RESTful API to give you world records, personal bests, and other information in your Discord chat rooms.

## Required Packages

The following must be ran to ensure all required packages are installed before launch:

```
npm install discord.js fs node-fetch
```

## Launch

LeaderBot requires Node.js version 12. Because of this, a .nvmrc file is included. It is therefor recommended that `nvm` be used to run the bot so that there are no version incompatabilities:

```
nvm run index.js
```

### Settings

Upon the first launch, a `settings.json` file will be created for you to provide your bot account's login key. After the login key is provided, you can run the bot again and it will begin normal operations.

## Commands

### !categories

Gets a list of categories for a given game or level:

* `!categories game`

### !help

Simple help command:

* `!help`

### !levels

Gets a list of levels for a given game:

* `!levels game`

### !pb

Gets a given player's personal best in a given game, category, or subcategory:

* `!pb player;game;category`
* `!pb player;game;level;category`
* ~~`!pb player;game;category[subcategory1|subcategory2|...]`~~
* ~~`!pb player;game;level;category[subcategory1|subcategory2|...]`~~

### !rules

Gets the rules of a given game, level, or category:

* `!rules game;category`
* `!rules game;level;category`

### !source

Provides a link to the source code:

* `!source`

### !subcategories

Gets a list of subcategories of a given category:

* `!subcategories game;category`
* `!subcategories game;level;category`

### !wr

Gets the world record of a given category or subcategory:

* `!wr game;category`
* `!wr game;level;category`
* ~~`!wr game;category[subcategory1|subcategory2|...]`~~
* ~~`!wr game;level;category[subcategory1|subcategory2|...]`~~