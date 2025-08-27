const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

function modulesList() {
  return [
    "📌 General",
    "🔨 Moderation",
    "🛡️ Security",
    "⚙️ Automod",
    "👋 Welcomer",
    "📑 Logging",
    "🎫 Ticket",
    "📋 Management",
    "🔧 Extra",
  ].join("\n");
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Explore Ghosty's commands"),

  async execute(interaction, client) {
    const now = new Date();
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const footer = `Requested by ${interaction.user.tag} • Today at ${time}`;

    const intro = new EmbedBuilder()
      .setAuthor({ name: "Ghosty", iconURL: client.user.displayAvatarURL() })
      .setDescription(
        "👋 **Hey, I’m Ghosty!**\n" +
          "I’m here to help you explore all of my commands.\n\n" +
          "• Use the dropdown to jump to a category.\n" +
          "• Use the buttons to navigate pages.\n" +
          "• Type `/help <command>` for specific command info."
      )
      .addFields({ name: "📂 Modules", value: modulesList() })
      .addFields({
        name: "Getting Started",
        value:
          "• Type `/help <command>`\n" +
          "• Official Docs: `https://ghostybot.xyz/docs`\n" +
          "• Troubleshooting: `https://ghostybot.xyz/`",
      })
      .addFields({
        name: "Premium",
        value:
          "Unlock advanced features with Ghosty Premium:\n" +
          "`https://discord.gg/YourPremiumLink`",
      })
      .setColor(0x2b2d31)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({ text: footer });

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help-menu")
      .setPlaceholder("Find Commands By Category")
      .addOptions(
        { label: "Giveaways Commands", value: "giveaways", emoji: "🎉" },
        { label: "Security Commands", value: "security", emoji: "🛡️" },
        { label: "Automod Commands", value: "automod", emoji: "⚙️" },
        { label: "Moderation Commands", value: "moderation", emoji: "🔨" },
        { label: "Management Commands", value: "management", emoji: "📋" },
        { label: "General Commands", value: "general", emoji: "📌" },
        { label: "Ignore Commands", value: "ignore", emoji: "🚫" },
        { label: "Utility Commands", value: "utility", emoji: "🔧" },
        { label: "Ticket Commands", value: "ticket", emoji: "🎫" },
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [intro],
      components: [row],
      ephemeral: true,
    });
  },
};
