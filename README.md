# Steam Deck Refurbished Stock Watcher

This Discord bot monitors the Steam Deck refurbished sale page and sends notifications when units become available.

## Setup

1. Create a new Discord Application and Bot at https://discord.com/developers/applications
2. Copy your bot token
3. Invite the bot to your server with proper permissions (Send Messages)
4. Copy the channel ID where you want to receive notifications (Developer Mode must be enabled to copy channel IDs)
5. Create a `.env` file with the following content:
   ```
   DISCORD_TOKEN=your_discord_bot_token_here
   DISCORD_CHANNEL_ID=your_channel_id_here
   CHECK_INTERVAL=60000
   ```
   Replace the values with your actual bot token and channel ID. The CHECK_INTERVAL is in milliseconds (default: 60 seconds)

## Running the Bot

1. Install dependencies:
   ```
   npm install
   ```
2. Start the bot:
   ```
   node index.js
   ```

The bot will check the Steam Deck refurbished page every minute (configurable via CHECK_INTERVAL in .env) and send a message to the specified Discord channel when stock becomes available.
