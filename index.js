require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { chromium } = require("playwright");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const STEAM_URL = "https://store.steampowered.com/sale/steamdeckrefurbished/";
let lastStatus = "out_of_stock";

async function checkSteamDeckAvailability() {
  let outOfStockCount = 0;
  try {
    console.log(`Checking availability at ${new Date().toLocaleString()}...`);

    // Launch browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the Steam page and wait for content to load
    await page.goto(STEAM_URL, { waitUntil: "networkidle" });
    await page.waitForLoadState("domcontentloaded");

    // Look for out of stock elements
    const outOfStockElements = await page.$$(".CartBtn");

    console.log(
      `Found ${outOfStockElements.length} elements to check for stock status.`
    );

    for (const element of outOfStockElements) {
      const text = await element.innerText();
      console.log("Found text:", text);
      if (
        text.toLowerCase().includes("out of stock") ||
        text.includes("Nincs raktáron")
      ) {
        outOfStockCount++;
      }
    }

    console.log(
      `Out of stock count: ${outOfStockCount}, Total elements checked: ${outOfStockElements.length}`
    );
    // Close browser
    await browser.close();

    // If fewer than 5 items are out of stock, consider it in stock
    const isOutOfStock = outOfStockCount >= 5;
    console.log(`Is out of stock: ${isOutOfStock}`);
    const currentStatus = isOutOfStock ? "out_of_stock" : "in_stock";
    console.log(`Current status: ${currentStatus}`);

    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      if (currentStatus === "in_stock") {
        await channel.send({
          content:
            "<@307943335606222858> 🎮 **Steam Deck Refurbished Available!**\n" +
            "Steam Deck refurbished units are now in stock!\n" +
            `Check here: ${STEAM_URL}\n` +
            `Date: ${new Date().toLocaleString()}`,
        });
      } else {
        await channel.send({
          content: `🔍 Checking availability: Steam Deck is currently **Out of Stock**\nDate: ${new Date().toLocaleString()}`,
        });
      }
    }

    lastStatus = currentStatus;
  } catch (error) {
    console.error("Error checking Steam Deck availability:", error.message);
  }
}

client.once("ready", () => {
  console.log("Bot is ready!");

  // Start checking availability
  setInterval(checkSteamDeckAvailability, parseInt(process.env.CHECK_INTERVAL));
  // Do an initial check
  checkSteamDeckAvailability();
});

// Handle errors
client.on("error", console.error);

// Add message handler for test command
client.on("messageCreate", async (message) => {
  if (message.content.toLowerCase() === "!test") {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      await channel.send({
        content:
          "🧪 **Test Notification**\n" +
          "This is a test message to verify the bot is working correctly!\n" +
          "When a real restock happens, you'll receive a similar notification.",
      });
    }
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
