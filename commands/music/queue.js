const {
  MessageEmbed,
  MessageButton,
  MessageSelectMenu,
  MessageActionRow
} = require("discord.js");
const config = require("../../config.json");
const ee = require("../../botconfig/embed.json");

module.exports = {
  name: "queue", //the command name for the Slash Command
  category: "Queue",
  aliases: ["list", "queuelist", 'q'],
  usage: "list",
  description: "Lists the current Queue",
  cooldown: 10000,

  run: async (client, message, args) => {
    try {
      //things u can directly access in an interaction!
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
            .setFooter({ text: ee.footertext, iconURL: ee.footericon})
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
        let embeds = [];
        let k = 16;
        let theSongs = newQueue.songs;
        //defining each Pages
        for (let i = 0; i < theSongs.length; i += 16) {
          let qus = theSongs;
          const current = qus.slice(i, k)
          let j = i;
          const info = current.map((track) => `**${j++} -** [\`${String(track.name).replace(/\[/igu, "{").replace(/\]/igu, "}").substr(0, 60)}\`](${track.url}) - \`${track.formattedDuration}\``).join("\n")
          const embed = new MessageEmbed()
            .setColor(ee.color)
            .setDescription(`${info}`)
          if (i < 10) {
            embed.setTitle(`📑 **Top ${theSongs.length > 50 ? 50 : theSongs.length} | Queue of ${guild.name}**`)
            embed.setDescription(`**(0) Current Song:**\n> [\`${theSongs[0].name.replace(/\[/igu, "{").replace(/\]/igu, "}")}\`](${theSongs[0].url})\n\n${info}`)
          }
          embeds.push(embed);
          k += 16; //Raise k to 10
        }
        embeds[embeds.length - 1] = embeds[embeds.length - 1]
          .setFooter({ text: ee.footertext + `\n${theSongs.length} Songs in the Queue | Duration: ${newQueue.formattedDuration}`, iconURL: ee.footericon})
        let pages = []
        for (let i = 0; i < embeds.length; i += 1) {
          pages.push(embeds.slice(i, i + 1));
        }
        pages = pages.slice(0, 24)
        const Menu = new MessageSelectMenu()
          .setCustomId("QUEUEPAGES")
          .setPlaceholder("Select a Page")
          .addOptions([
            pages.map((page, index) => {
              let Obj = {};
              Obj.label = `Page ${index}`
              Obj.value = `${index}`;
              Obj.description = `Shows the ${index}/${pages.length - 1} Page!`
              return Obj;
            })
          ])
        const close = new MessageActionRow().addComponents(
          new MessageButton({
            label: 'Close',
            style: 'DANGER',
            emoji: '864690410232610836',
            customId: 'close'
          }),
          new MessageButton({
            label: `Requested By: ${message.author.tag}`,
            style: 'PRIMARY',
            disabled: true,
            customId: 'request',
          })
        )
        const row = new MessageActionRow().addComponents([Menu])
        let queuemessage = await message.reply({
          embeds: [embeds[0]],
          components: [row, close],
        });
        //Event
        const filter = async interaction => {

            if (interaction.user.id !== message.author.id) {
              interaction.reply({
                content: "<:AAcross_box:864690410232610836> Don't touch user's song queue button",
                ephemeral: true
              });
              return false;
            };
          
            return true;
          }
        const collectorButton = await queuemessage.createMessageComponentCollector({
          filter,
          componentType: 'BUTTON',
        })
        const collector = await queuemessage.createMessageComponentCollector({
          filter,
          componentType: 'SELECT_MENU',
        })
        collectorButton.on('collect', button => {
          if(button.customId === 'close'){
            button.update({
              embeds: [
                  new MessageEmbed()
                    .setTitle('```Song queue list(s) has been closed!```')
              ], components: []  
            })
            collector.stop();
          };
        });
        
        collector.on('collect', (i) => {
          // i.deferUpdate();
          if (i.customId === "QUEUEPAGES" && i.applicationId == client.user.id) {
            i.update({
              embeds: pages[Number(i.values[0])],
            }).catch(e => { })
          }
        });
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
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  }
}