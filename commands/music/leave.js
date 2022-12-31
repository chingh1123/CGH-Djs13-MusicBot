const { MessageEmbed } = require('discord.js');
const ee = require('../../botconfig/embed.json');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  name: 'leave',
  aliases: ['disconnect', 'dc'],
  description: 'leave the voice channel',
  cooldown: 5000,

  run: async (client, message, args) => {

    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You didnt get in voice channel yet!');

    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      message.reply({
        embeds: [
          new MessageEmbed().setColor(ee.wrongcolor).setTitle(`**Erm I am not at this voice channel.**`)
        ],
      })
    } else {
      connection.destroy();
      await message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle('👋 See you next time')
            .setColor('YELLOW')
        ]
      });
    }
  }
}