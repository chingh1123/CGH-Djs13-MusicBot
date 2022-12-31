const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'join',
  description: 'join in to the voice channel',
  cooldown: 5000,

  run: async (client, message, args) => {

    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('You didnt get in voice channel yet!');

    await joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    message.react('👍');
  }
}