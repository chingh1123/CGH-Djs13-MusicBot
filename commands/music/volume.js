const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "volume",
	category: "Queue",
	aliases: ["vol", "v"],
	usage: "volume <newVolume>",
	description: "Adjusts the Volume of the Music",
	cooldown: 10000,

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
                    if(newQueue.volume >= 50){
					    message.reply(`🔊 The current volume now is: ${newQueue.volume}\n**Type \`gh volume <number>\` to adjust the volume!**`);
                    }
                    if (newQueue.volume < 50){
                        message.reply(`🔉 The current volume now is: ${newQueue.volume}\n**Type \`gh volume <number>\` to adjust the volume!**`);
                    }
				}
				let volume = Number(args[0])
				if (volume > 150 || volume < 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`❌ **The Volume must be between \`0\` and \`150\`!**`)
					],

				})
				await newQueue.setVolume(volume);
				message.reply({
					content: `🔊 **Changed the Volume to \`${volume}\`!**\n>  💝 **Requested by**: \`${member.user.tag}\``
				})
			} catch (e) {
                return;
			}
	}
}