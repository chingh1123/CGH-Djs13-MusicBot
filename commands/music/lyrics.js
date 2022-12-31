const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");
const ee = require('../../botconfig/embed.json');

module.exports = {
    name: "lyrics",
    description: "Get lyrics for the currently playing song",
    usage: "[lyrics]",
    aliases: ["ly"],
    cooldown: 7000,

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
				let newQueue = client.distube.getQueue(guildId);
        let newTrack = newQueue.songs[0];
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **I am nothing Playing right now!**`)
					],

				})

    let lyrics = null;

    try {
      lyrics = await lyricsFinder(newTrack.name, "");
      if (!lyrics) lyrics = `No lyrics found for ${newTrack.name}.`;
    } catch (error) {
      lyrics = `No lyrics found for ${newTrack.name}.`;
    }

    let lyricsEmbed = new MessageEmbed()
      .setAuthor({ name: `🌿 Song Lyrics`, iconURL: "https://c.tenor.com/HJvqN2i4Zs4AAAAj/milk-and-mocha-cute.gif"})
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setColor("RANDOM")
      .setDescription(`${lyrics}`)
      .setTimestamp();

    if (lyricsEmbed.description.length >= 2048)
      lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
    return message.channel.send({ embeds: [lyricsEmbed] }).catch(console.error);
  } catch (e) {
    console.log(e)
  }
  }
}