const discord = require('discord.js');
module.exports = {
  name: "ping",
  description: "To see the bot latency",
  usage: "[ping]",
  aliases: ["pg"],
  cooldown: 3000,

  run: async (client, message, args) => {
    let embed = new discord.MessageEmbed()
      .setTitle('🏓🏓🏓')
      .setDescription(`Pong - ${client.ws.ping}ms`)
      .setColor("BLUE")
      .setFooter({ text: `Requested by ${message.author.username}`})
    message.channel.send({ embeds: [embed] })
  },
}