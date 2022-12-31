const {
	MessageEmbed,
	Message
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
	name: "jump", 
	category: "Queue",
	aliases: ["jump", "skipto"],
	usage: "jump <SongPosition>",
	description: "Jumps to a specific Song in the Queue",
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
							.setTitle(`:x: **Please add a Position to jump to!**`)
							.setDescription('`gh skipto <position>`')
						],
					});
				}
				let Position = Number(args[0])
				if (Position > newQueue.songs.length - 1 || Position < 0) return message.reply({
					embeds: [
						new MessageEmbed().setColor(ee.wrongcolor).setTitle(`:x: **The Position must be between \`0\` and \`${newQueue.songs.length - 1}\`!**`)
					],
				})
				await newQueue.jump(Position);
				message.reply({
					content: `👌 **Jumped to the \`${Position}th\` Song in the Queue!**\n> 💝 **Requested by**: \`${message.author.tag}\``
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