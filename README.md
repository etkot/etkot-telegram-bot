# Etkot Telegram Bot

Telegram bot for Etkot

# Installation

You will need node.js and MongoDB

```sh
git clone https://github.com/Etkot/etkot-telegram-bot
cd etkot-telegram-bot
npm install
```

# Usage

Before starting you will need to create a file called `.env` with the following fields

```
# Telegram
TG_TOKEN=[Your telegram bot token]
TG_CHAT=[Your telegram chat id]

# MongoDB
DB_NAME=[Name of your MongoDB database]
DB_ADDR=[Address of DB default: 'localhost']
DB_PORT=[Port of DB default: '27017']

# Minecraft Server
MC_ADDR=[Minecraft server address]
MC_PORT=[Minecraft server port]
```

Now you can start the bot

```sh
npm start
```
