# khaos-utils
bot for khaos

## Features
Khaos Utilities comes with a variety of features which were custom made for Khaos discord. A few are:
- Moderation (timeouts, ban, kick, unban, baninfo)
- Application handling (creating an application token and verifying it to prevent app spam)
- Promote members (non members > trial, trial > full member)
- Create polls (yes/no or multiple choice (up to 9 different choices)
- Inactive command (Allows members to declare themselves as inactive)
- Tags (works as embeds you can request through a command)
- Status (Know if your minecraft servers are online/offline)
- [Bridge the gap discord](https://github.com/KhaosMC/bridge-the-gap-discord) client integrated
- Fetch pictures of animals from Flickr
- Ask for definition of words from Urban Dictionary

## Todo
- Application management with database (create tickets, handle them etc)
- Project management

# Prerequisits
To download the bot (and its dependencies). You may need to install `build-essential` on Linux, or the equivalent for any other OS:
```
git clone https://github.com/KhaosMC/khaos-utils
cd khaos-utils
npm i sqlite3 --save
npm i sqlite --save
npm i discord.js@13 ws ms fs moment crypto node-fetch@2 dotenv relevant-urban
```

# Usage
Modify the configs in `config` directory and copy `.env.example` to `.env` and modify it accordingly, then
```
node index.js
```
from the working directory of the source code.

If you have any further questions, feel free to dm me on discord `Ainsley#6969` o/
