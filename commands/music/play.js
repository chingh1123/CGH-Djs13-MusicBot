const {
  MessageEmbed,
  Message,
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
  name: "play",
  category: "Music",
  aliases: ["p", "paly", "pley"],
  usage: "play <Search/link>",
  description: "Plays a Song/Playlist in your VoiceChannel",
  cooldown: 2,

  run: async (client, message, args) => {
    try {
      const {
        member,
        channelId,
        guildId,
      } = message;
      const {
        guild
      } = member;
      const {
        channel
      } = member.voice;
      if (!channel) return message.reply({
        embeds: [
          new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **Please join ${guild.me.voice.channel ? "__my__" : "a"} VoiceChannel First!**`)
        ],

      })
      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
      
      if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak in this voice channel, make sure I have the proper permissions!");

      if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon})
            .setTitle(`:x: I am already connected somewhere else`)
          ],
        });
      }
      if (!args[0]) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon})
            .setTitle(`:x: **Please add a Search Query!**`)
          ],
        });
      }
      const Text = args.join(" ")
      try {
        let queue = client.distube.getQueue(guildId)
        let options = {
          member: member,
        }
        if (!queue) options.textChannel = guild.channels.cache.get(channelId)
        await client.distube.playVoiceChannel(channel, Text, options)
        if (channel.type === "GUILD_STAGE_VOICE" && message.guild.me.voice.suppress) {
          try {
            await message.guild.me.voice.setSuppressed(false);
          } catch (e) {
            message.reply({ embeds: [
                new MessageEmbed()
                .setTitle(`I can't be the stage moderator! `)
                .setDescription('To let me become the stage moderator, please go to the stage channel settings and add me into it.')
                .setImage('https://cdn.discordapp.com/attachments/851287450037911572/954373945853874297/unknown.png')
                .setColor('RANDOM')
            ]})
          }
        }
        return
      } catch (e) {
        console.log(e.stack ? e.stack : e)
        message.reply({
          content: `:x: | Error: `,
          embeds: [
            new MessageEmbed().setColor(ee.wrongcolor)
              .setDescription(`\`\`\`${e}\`\`\``)
          ],
        })
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}