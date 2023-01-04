const {
  Client,
  Collection,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Intents
} = require("discord.js");
const libsodium = require("libsodium-wrappers");
const ffmpeg = require("ffmpeg-static");
const voice = require("@discordjs/voice");
const { AudioPlayerStatus } = require('@discordjs/voice');
const DisTube = require("distube").default;
const ee = require("./botconfig/embed.json");
const PlayerMap = new Map();

const client = new Client({
  intents: [
    'GUILD_MESSAGES',
    'GUILDS',
    'GUILD_VOICE_STATES'
  ]
});
module.exports = client;

client.config = require("./config");

const { SoundCloudPlugin } = require("@distube/soundcloud");

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: false,
  leaveOnStop: true,
  savePreviousSongs: true,
  emitAddSongWhenCreatingQueue: false,
  searchSongs: 0,
  emptyCooldown: 25,
  ytdlOptions: {
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
  },
  youtubeDL: true,
  updateYouTubeDL: true,
  plugins: [
    new SoundCloudPlugin()
  ]
})

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.queue = new Map();

const prefix = client.config.prefix;
const keepAlive = require('./keepAlive.js');

// Initializing the project
require("./handler")(client);
require('dotenv').config();

client.distube.on(`addSong`, (queue, song) => queue.textChannel.send({
  embeds: [
    new MessageEmbed()
      .setColor(ee.color)
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)
      .setFooter({ text: "Requested By: " + song.user.tag, iconURL: song.user.displayAvatarURL({
        dynamic: true
      })
})
      .setTitle(`✅ **Song added to the Queue!**`)
      .setDescription(`👍 Song: [\`${song.name}\`](${song.url})  -  \`${song.formattedDuration}\``)
      .addField(`⌛ **Duration:**`, `\`${queue.songs.length - 1} song${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - song.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
  ]
}));

client.distube.on(`playSong`, async (queue, track) => {
  var newQueue = client.distube.getQueue(queue.id)
  var newTrack = newQueue.songs[0];
  queue.textChannel.send({
    embeds: [
      new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`${newTrack.name}`)
        .setURL(`${newTrack.url}`)
        .addField(`⏱ Duration:`, `>>> \`${newTrack.formattedDuration}\``, true)
        .addField(`🌀 Queue:`, `>>> \`${newQueue.songs.length} song(s)\`\n\`${newQueue.formattedDuration}\``, true)
        .addField(`🔊 Volume:`, `>>> \`${Math.floor(newQueue.volume)} %\``, true)
        .setAuthor({ name: `Started Playing Music!`, iconURL: `https://img.yqqlm.com/index/index/getInterUrl?uicrIvZQ=e9ec4bba68bf0e6fe48c1fb9a0c9b8b2`})
        .setThumbnail(`https://img.youtube.com/vi/${newTrack.id}/mqdefault.jpg`)
        .setFooter({ text: `Requested By ${newTrack.user.tag}`, iconURL: newTrack.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
    ]
  }).then(msg => {
    PlayerMap.set(`currentmsg`, msg.id);
    return msg;
  })
});

client.distube.on(`addList`, (queue, playlist) => queue.textChannel.send({
  embeds: [
    new MessageEmbed()
      .setColor(ee.color)
      .setThumbnail(playlist.thumbnail.url ? playlist.thumbnail.url : `https://img.youtube.com/vi/${playlist.songs[0].id}/mqdefault.jpg`)
      .setFooter({ text: playlist.user.tag, iconURL: playlist.user.displayAvatarURL({
        dynamic: true
      })})
      .setTitle(`🔻 Imported: \`${playlist.name}\`  -  \`${playlist.songs.length} Song${playlist.songs.length > 0 ? "s" : ""}\``)
      .setURL(`${playlist.url ? playlist.url : ""}`)
      .addField(`⌛ **Playlist Duration:**`, `\`${queue.songs.length - playlist.songs.length} song${queue.songs.length > 0 ? "s" : ""}\` - \`${(Math.floor((queue.duration - playlist.duration) / 60 * 100) / 100).toString().replace(".", ":")}\``)
      .addField(`🌀 **Queue Duration:**`, `\`${queue.formattedDuration}\``)
  ]
}));

client.distube.on(`finish`, queue => {
  try{
  queue.textChannel.send({ embeds: [
    new MessageEmbed()
      .setDescription('Song has been played finish...\n\nEnjoy my music? Vote me on [top.gg!](https://top.gg/bot/837564399833055272/vote/)')
      .setColor('RANDOM')
  ]})
  } catch (err) {
  console.log(err);
}
})

keepAlive();

client.login('token here');
