const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "remove", 
	category: "Queue",
	usage: "remove <What_song> [Amount]",
	description: "Removes one+ Song(s)",
  cooldown: 7000,

	run: async (client, message, args) => {
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
				if (!args[0]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`:x: **Please add a Song-Position!**`)
							.setDescription(`**gh remove <song position number>**`)
						],
					});
				}
				let songIndex = Number(args[0]);
				if (!songIndex) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`:x: **Please add a Song-Position!**`)
							.setDescription(`**gh remove <song position number>**`)
						],
					});
				}
				let amount = Number(args[1] ? args[1] : "1");
				if (!amount) amount = 1;
				if (songIndex > newQueue.songs.length - 1) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **This Song does not exist!**`)
						.setDescription(`**The last Song in the Queue has the Index: \`${newQueue.songs.length}\`**`)
					],

				})
				if (songIndex <= 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **You can't remove the current Song (0)!**`)
						.setDescription('**Use `gh skip` instead!**')
					],

				})
				if (amount <= 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **You need to at least remove 1 Song!**`)
					],

				})
				newQueue.songs.splice(songIndex, amount);
				message.reply({
					content: `🗑 **Removed ${amount} Song${amount > 1 ?"s": ""} out of the Queue!**\n> 💢 **Action by**: \`${member.user.tag}\``
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
	}
}