const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
  name: "skip",
  category: "Music",
  aliases: ["s"],
  usage: "skip",
  description: "Skips the Current Track",
  cooldown: 8000,
  run: async (client, message, args) => {
    try {
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = message;
      const {
        guild
      } = member;
      const {
        channel
      } = member.voice;
      if (!channel) return message.reply({
        embeds: [
          new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **Please join ${guild.me.voice.channel ? "my" : "a"} VoiceChannel First!**`)
        ],
      })
      if (channel.guild.me.voice.channel && channel.guild.me.voice.channel.id != channel.id) {
        return message.reply({
          embeds: [new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`:x: Join __my__ Voice Channel!`)
            .setDescription(`<#${guild.me.voice.channel.id}>`)
          ],
        });
      }
      try {
        let newQueue = client.distube.getQueue(guildId);
        if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
          embeds: [
            new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **I am nothing Playing right now!**`)
          ],
        })
        await newQueue.skip();
        message.reply({
          content: `⏭ **Skipped to the next Song!**`
        })
      } catch (e) {
        message.reply({
          content: `There is no up next song to skip.`
        })
      }
    } catch (e) {
      message.reply('Please turn off the loop before skip to the next song!')
    }
  }
}