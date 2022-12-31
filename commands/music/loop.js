const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "loop",
    cooldown: 7000,
	category: "Queue",
	aliases: ["repeat", "repeatmode", "l"],
	usage: "loop <song/queue/off>",
	description: "Enable/Disable the Song- / Queue-Loop",
	cooldown: 10000,
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
				if (!args[0]) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`:x: **Please add valid Options!**`)
							.setDescription('**gh loop <song/queue/off>**\n\n`loop song` - repeat the song that are current playing\n`loop queue` - repeat the songs that are in the queue\n`loop off` - turn off the repeat mode of the song')
						],
					});
				}
				let loop = args[0]
				if (!loop) {
					return message.reply({
						embeds: [new MessageEmbed()
							.setColor(ee.wrongcolor)
							.setFooter(ee.footertext, ee.footericon)
							.setTitle(`:x: **Please add valid Options!**`)
							.setDescription('**gh loop <song/queue/off>**\n\n`loop song` - repeat the song that are current playing\n`loop queue` - repeat the songs that are in the queue\n`loop off` - turn off the repeat mode of the song')
						],
					});
				}
				if (loop == "off") loop = 0;
                if (loop == "song") loop = 1;
				if (loop == "queue") loop = 2;
				await newQueue.setRepeatMode(loop);
				if (newQueue.repeatMode == 0) {
					message.reply({
						content: `:x: **Disabled the Loop Mode!**\n> 💢 **Action by**: \`${member.user.tag}\``
					})
				} else if (newQueue.repeatMode == 1) {
					message.reply({
						content: `🔂 **Enabled the __Song__-Loop!**\n- Disabled the **Queue-Loop**\n> 💝 **Requested by**: \`${member.user.tag}\``
					})
				} else {
					message.reply({
						content: `🔂 **Enabled the __Queue__-Loop!**\n- Disabled the **Song-Loop**)\n> 💝 **Requested by**: \`${member.user.tag}\``
					})
				}
			} catch (e) {
				// console.log(e.stack ? e.stack : e)
				let errArgs = await message.reply('Please specify the correct args!')
                setTimeout(() => {
                    errArgs.delete()
                }, 5000)
			}
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	}
}