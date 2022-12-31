const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "stop",
	category: "Music",
	aliases: ["break", "destroy"],
	usage: "stop",
	description: "Stops playing and leaves the Channel!",
  cooldown: 8000, 
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
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0)return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **I am nothing Playing right now!**`)
					],
				})
				await newQueue.stop()
				//Reply with a Message
				message.reply({
					content: `⏹ **Stopped playing and left the Channel**\n>  💝 **Requested by**: \`${message.author.tag}\``
				})
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
	}
}