const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");
const PlayerMap = new Map()

module.exports = (client) => {
  var newQueue = client.distube.getQueue(queue.id)
  var newTrack = newQueue.songs[0];
  var data = receiveQueueData(newQueue, newTrack)
  //Send message with buttons
  let currentSongPlayMsg = await queue.textChannel.send(data).then(msg => {
    PlayerMap.set(`currentmsg`, msg.id);
    return msg;
  })
  client.distube
    .on(`addSong`, (queue, song) => queue.textChannel.send({
      embeds: [
        new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
          .setFooter("💯 " + song.user.tag, song.user.displayAvatarURL({
            dynamic: true
          }))
          .setTitle(`✅ **Song added to the Queue!**`)
          .setDescription(`👍 Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
          .addField(`⌛ **Estimated Time:**`, `\`${queue.songs.length - 1} song${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
          .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
      ]
    }))
    .on(`empty`, channel => channel.send(`😕 Voice channel is empty! Leaving the channel...`));

  function receiveQueueData(newQueue, newTrack) {
    if (!newTrack) return new MessageEmbed().setColor(ee.wrongcolor).setTitle("NO SONG FOUND?!?!")
    var embed = new MessageEmbed().setColor(ee.color)
      .addField(`💡 Requested by:`, `>>> ${newTrack.user}`, true)
      .addField(`⏱ Duration:`, `>>> \`${newQueue.formattedCurrentTime} / ${newTrack.formattedDuration}\``, true)
      .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
      .addField(`🔊 Volume:`, `>>> \`${newQueue.volume} %\``, true)
      .setAuthor(`${newTrack.name}`, `https://cdn.discordapp.com/attachments/899305455493459989/899698528518021150/cgh.png`, newTrack.url)
      .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
      .setFooter(`💯 ${newTrack.user.tag}`, newTrack.user.displayAvatarURL({ dynamic: true }));
  }
}