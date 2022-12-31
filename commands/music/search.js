const {
  MessageEmbed,
  Message
} = require("discord.js");
const ee = require("../../botconfig/embed.json");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const fs = require('fs');

module.exports = {
  name: "search",
  category: "Music",
  aliases: ["srh", "searchsong"],
  usage: "play <Search/link>",
  description: "Plays a Song/Playlist in your VoiceChannel",
  cooldown: 2000,
  run: async (client, message, args) => {
    try{
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
          .setTitle(`<:AAcross_box:864690410232610836> I am already connected somewhere else`)
        ],
      });
    }
    if (!args[0]) {
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon})
          .setTitle(`:x: **Please provide a Search Query!**`)
        ],
      });
    }

    const Text = args.join(" ");
    var searched = await YouTube.search(Text, { limit: 10 });
    if (searched[0] == undefined) return message.channel.send("Looks like i was unable to find the song on YouTube");
    let index = 0;
    let embedPlay = new MessageEmbed()
      .setColor("BLUE")
      .setAuthor({ name: `Results for \"${args.join(" ")}\"`, iconURL: message.author.displayAvatarURL()})
      .setDescription(`${searched.map(video2 => `**\`${++index}\`  |** \`${video2.title}\` - \`${video2.durationFormatted}\``).join("\n\n")}`)
      .setFooter({ text: "Type the number of the song to add it to the queue"});

    let m = await message.channel.send({ embeds: [embedPlay] });
    setTimeout(() => m.delete(), 13000)
    try {
      let queue = client.distube.getQueue(guildId)
      let options = {
        member: member,
      }
      if (!queue) options.textChannel = guild.channels.cache.get(channelId)
      try {
        const filter = message2 => message2.content > 0 && message2.content < 11;
        var response = await message.channel.awaitMessages({
          filter,
          max: 1,
          time: 20000,
          errors: ["time"]
        });
      } catch (err) {
        console.error(err);
        return message.channel.send({
          embeds: [
            new MessageEmbed({
              color: "RED",
              description: "Nothing has been selected within 20 seconds, the request has been canceled."
            })
          ]
        });
      }
      const videoIndex = parseInt(response.first().content);
      let video = await (searched[videoIndex - 1]);
      await client.distube.playVoiceChannel(channel, video, options)
      if (channel.type === "GUILD_STAGE_VOICE" && message.guild.me.voice.suppress) {
        try {
          await message.guild.me.voice.setSuppressed(false);
        } catch (e) {
          message.reply(`Can't Play This Link That You Are Given.`)
        }
      }
      return
    } catch (e) {
      message.reply({
        content: `Can't Play This Link That You Are Given.`
      })
    }
    } catch (e) {
      console.log(e);
    }
  }
}