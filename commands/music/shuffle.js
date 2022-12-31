const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "shuffle",
	category: "Queue",
	usage: "shuffle",
	description: "Shuffles (Mixes) The Queue",
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
        let volume = Number(args[0]);
				let newQueue = client.distube.getQueue(guildId);
				if (!newQueue || !newQueue.songs || newQueue.songs.length == 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **I am nothing Playing right now!**`)
					],

				})
				await newQueue.shuffle(volume);
				message.reply({
					content: `🔀 **Suffled ${newQueue.songs.length} Songs!**\n> 💝 **Requested by**: \`${member.user.tag}\``
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