const { MessageEmbed, Message } = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "nowplaying",
	category: "Song",
	usage: "nowplaying",
	aliases: ["np", "current"],
	description: "Shows the current Playing Song",
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
			try {
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **I am nothing Playing right now!**`)
					],
				})
				let newTrack = newQueue.songs[0];
                let vie = newTrack.views.toString()
                let lik = newTrack.likes.toString()
				message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.color)
            .setAuthor({ name: 'Now Playing', iconURL: 'https://media.discordapp.net/attachments/821270469172658196/845709703358971904/Music.gif'})
						.setTitle(newTrack.name)
						.setURL(newTrack.url)
						.addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
						.addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
						.addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
						.addField(`🔊 Volume:`, `>>> \`${Math.floor(newQueue.volume)} %\``, true)
						.addField(`♾ Loop:`, `>>> ${newQueue.repeatMode ? newQueue.repeatMode === 2 ? `✅\` Queue\`` : `✅ \`Song\`` : `:x:`}`, true)
						.addField(`<:youtube:855362502229753896>  View${newTrack.views > 0 ? "s": ""}:`, `>>> \`${vie.replace(/(.)(?=(\d{3})+$)/g,'$1,')}\``, true)
						.addField(`:thumbsup: Like${newTrack.likes > 0 ? "s": ""}:`, `>>> \`${lik.replace(/(.)(?=(\d{3})+$)/g,'$1,')}\``, true)
                        .addField(`♥️ Song Uploader:`, `>>> \`${newTrack.uploader.name}\``, true)
						.addField('📻 Channel',`> <#${message.member.voice.channel.id}>`, true)
						.setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
						.setFooter({ text: `Played in: ${guild.name}`, iconURL: guild.iconURL({
							dynamic: true
						})}).setTimestamp()
					]
				}).catch((e) => {
					console.log(e.stack ? e.stack : e)
				})
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