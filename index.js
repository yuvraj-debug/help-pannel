require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
  EmbedBuilder,
  Partials,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
  partials: [Partials.Channel],
});

client.commands = new Collection();


const commandsPath = __dirname;
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".js") && f !== "index.js");

const slashData = [];
for (const file of commandFiles) {
  const cmd = require(path.join(commandsPath, file));
  if (cmd?.data && cmd?.execute) {
    client.commands.set(cmd.data.name, cmd);
    slashData.push(cmd.data.toJSON());
  }
}


async function registerSlash() {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  await rest.put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: slashData }
  );
  console.log("✓ Slash commands registered to guild.");
}



client.once("ready", async () => {
  console.log(`${client.user.tag} is online!`);
  try {
    await registerSlash();
  } catch (err) {
    console.error("Slash registration failed:", err);
  }
});


client.on("interactionCreate", async (interaction) => {
  
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      const responded = interaction.replied || interaction.deferred;
      const content = "❌ There was an error while executing this command.";
      if (responded) {
        await interaction.followUp({ content, ephemeral: true }).catch(() => {});
      } else {
        await interaction.reply({ content, ephemeral: true }).catch(() => {});
      }
    }
    return;
  }

 
  if (interaction.isStringSelectMenu() && interaction.customId === "help-menu") {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const footer = `Requested by ${interaction.user.tag} • Today at ${time}`;

    
    const base = (title, description, icon) =>
      new EmbedBuilder()
        .setAuthor({
          name: title,
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setDescription(description)
        .setColor(0x2b2d31) 
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .setFooter({ text: footer });

    let embed;

    switch (interaction.values[0]) {
      case "giveaways":
        embed = base(
          "🎉 Giveaways Commands",
          "**Giveaway**\n" +
            "• `/giveaway start` – Start a new giveaway.\n" +
            "• `/giveaway end` – End a giveaway.\n" +
            "• `/giveaway reroll` – Reroll a giveaway winner.\n" +
            "• `/giveaway list` – List all active giveaways."
        );
        break;

      case "security":
        embed = base(
          "🛡️ Security Commands",
          "**Security**\n" +
            "• `/antinuke` – Shows all Anti-Nuke commands.\n" +
            "• `/antinuke enable` – Enable the Anti-Nuke system.\n" +
            "• `/antinuke disable` – Disable the Anti-Nuke system.\n" +
            "• `/antinuke show` – Show current settings.\n" +
            "• `/whitelist add <user>` – Add bypass user.\n" +
            "• `/whitelist remove <user>` – Remove bypass user.\n" +
            "• `/whitelist list` – Show whitelist.\n" +
            "• `/extraowner set <user>` – Add bypass owner.\n" +
            "• `/extraowner remove <user>` – Remove bypass owner.\n" +
            "• `/extraowner show` – Show bypass owners."
        );
        break;

      case "automod":
        embed = base(
          "⚙️ Automod Commands",
          "**Raidmode / Automod**\n" +
            "• `/automod` – Show automod commands.\n" +
            "• `/automod enable` – Enable automod.\n" +
            "• `/automod disable` – Disable automod.\n" +
            "• `/automod ignore` – Manage whitelist.\n" +
            "• `/automod punishment` – Set automod punishment."
        );
        break;

      case "moderation":
        embed = base(
          "🔨 Moderation Commands",
          "**Moderation**\n" +
            "• `/mute <user> <time>` – Timeout a user.\n" +
            "• `/kick <user>` – Kick user.\n" +
            "• `/ban <user>` – Ban user.\n" +
            "• `/warn add <user>` – Warn user.\n" +
            "• `/warn list <user>` – List warnings.\n" +
            "• `/purge amount <n>` – Clear messages.\n" +
            "• `/lock [channel]` – Lock channel.\n" +
            "• `/unlock [channel]` – Unlock channel.\n" +
            "• `/hide [channel]` – Hide channel.\n" +
            "• `/unhide [channel]` – Unhide channel."
        );
        break;

      case "management":
        embed = base(
          "📋 Management Commands",
          "**Management**\n" +
            "• `/media setup <channel>` – Setup media.\n" +
            "• `/media config` – Show config.\n" +
            "• `/maintenance on` – Enable maintenance.\n" +
            "• `/maintenance off` – Disable maintenance.\n" +
            "• `/jail setup` – Setup jail system.\n" +
            "• `/jail user <user>` – Jail a user.\n" +
            "• `/jail list` – List jailed users.\n" +
            "• `/joinnick create <name>` – Create joinnick.\n" +
            "• `/joinnick list` – List templates."
        );
        break;

      case "general":
        embed = base(
          "📌 General Commands",
          "**General**\n" +
            "• `/avatar [user]` – Get user avatar.\n" +
            "• `/banner user [user]` – Get user banner.\n" +
            "• `/servericon` – Server icon.\n" +
            "• `/serverinfo` – Server info.\n" +
            "• `/userinfo [user]` – User info.\n" +
            "• `/ping` – Bot ping.\n" +
            "• `/uptime` – Bot uptime.\n" +
            "• `/invite` – Bot invite.\n" +
            "• `/stats` – Bot stats."
        );
        break;

      case "ignore":
        embed = base(
          "🚫 Ignore Commands",
          "**Ignore**\n" +
            "• `/ignore channel add` – Ignore channel.\n" +
            "• `/ignore user add` – Ignore user.\n" +
            "• `/ignore command add` – Ignore command.\n" +
            "• `/ignore bypass add` – Add bypass."
        );
        break;

      case "utility":
        embed = base(
          "🔧 Utility Commands",
          "**Extra / Utility**\n" +
            "• `/embed` – Create embed.\n" +
            "• `/customrole create` – Create alias.\n" +
            "• `/autoresponse create` – Create autoresponse.\n" +
            "• `/list roles` – List roles.\n" +
            "• `/autorole setup` – Setup autoroles.\n" +
            "• `/welcome setup` – Setup welcome system."
        );
        break;

      case "ticket":
        embed = base(
          "🎫 Ticket Commands",
          "**Tickets**\n" +
            "• `/ticket setup` – Create ticket panel.\n" +
            "• `/ticket adduser <user>` – Add user to ticket.\n" +
            "• `/ticket removeuser <user>` – Remove user.\n" +
            "• `/ticket close` – Close ticket.\n" +
            "• `/ticket stats` – View stats."
        );
        break;
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
});

client.login(process.env.TOKEN);
