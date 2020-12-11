# LeaderBot

Runs on Node.js.

Upon the first startup, a settings file is created for you to provide your bot account's login key.

After the login key is provided, the bot will begin normal operations.

## Commands

*Some of these are still a work in progress and not yet implemented.*

### !categories

Gets a list of categories for a game.

`!categories game`

`!categories game;level`

### !help

Simple help command.

`!help`

`!help command`

### !levels

Gets a list of levels for a game.

`!levels game`

### !pb

Gets a player's personal best.

`!pb player;game;category`

`!pb player;game;level;category`

`!pb player;game;category[subcategory1|subcategory2|...]`

`!pb player;game;level;category[subcategory1|subcategory2|...]`

### !rules

Gets the rules of a category.

`!rules game`

`!rules game;category`

`!rules game;level;category`

### !source

Provides a link to the source code.

`!source`

### !subcategories

Gets a list of subcategories of a category.

`!subcategories game;category`

`!subcategories game;level;category`

### !wr

Gets the world record of a category.

`!wr game;category`

`!wr game;level;category`

`!wr game;category[subcategory1|subcategory2|...]`

`!wr game;level;category[subcategory1|subcategory2|...]`
