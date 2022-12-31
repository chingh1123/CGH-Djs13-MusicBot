const client = require("../index");
const { Collection } = require('discord.js');
const Timeout = new Collection();
const ms = require('ms');

client.on("messageCreate", async (message) => {
    if (
        message.author.bot ||
        !message.guild ||
!message.content.toLowerCase().startsWith(client.config.prefix)
    ) return;

    const [cmd, ...args] = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));

    if (command) {
        if (command.cooldown) {     if(Timeout.has(`${command.name}${message.author.id}`)) return message.channel.send(`⏲️ | You are on a \`${ms(Timeout.get(`${command.name}${message.author.id}`) - Date.now(), { long: true })}\` cooldown.`)
          command.run(client, message, args)
          Timeout.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
          setTimeout(() => Timeout.delete(`${command.name}${message.author.id}`), 4500)
        } else command.run(client, message, args);
      }
    
  process.on("unhandledRejection", (reason, promise) => {
    try {
      console.error("Error occured: ", promise, "reason: ", reason.stack || reason);
    } catch {
      console.error(reason);
    }
  });

  process.on("uncaughtException", (err) => {
      console.log(err);
  });
  require('events').EventEmitter.defaultMaxListeners = 30
});