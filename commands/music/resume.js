const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  name: 'resume',
  description: 'resume the music',
  cooldown: 6000,

  run: async (client, message, args) => {
    try{
    const member = message.author;
    //get the channel instance from the Member
    const channel = message.guild.channels.cache.get(message.member.voice.channel.id);
    //if the member is not in a channel, return
    if (!channel)
      return message.reply({
        content: `:x: **Please join a Voice Channel first!**`,
      })
    // if (newQueue.playing) {
      let guildId = message.guild.id;
      await client.distube.resume(guildId);
      message.reply({
        content: `▶️ **Resumed!**\n> 💝 **Requested by**: \`${message.author.tag}\``,
      })
    message.react('▶️')
     } catch(e) {
       message.channel.send('The queue has been resumed');
     }
  }
}