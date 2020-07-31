const RohoClient = require('./src/Structures/RohoClient');
const config = require('./config.json');

const client = new RohoClient(config);
client.start();

// let botconfig = require('./botconfig.json');
// const Discord = require('discord.js');
// const bot = new Discord.Client();
// const fs = require('fs');

// bot.commands = new Discord.Collection();

// async function read() {
//     fs.readdir("./commands/", (err, files) => {
//         if (err) console.log(err);
    
//         let jsfile = files.filter(f => f.split(".").pop() === "js");
//         if (jsfile.length <= 0) {
//             console.log("No commands found.");
//             return;
//         }
    
//         jsfile.forEach( (f, i) => {
//             let props = require(`./commands/${f}`);
//             console.log(`${f} loaded!`);
//             bot.commands.set(props.help.name, props);
//             props.init(bot);
//         });
//     });
// }

// bot.on('ready', async () => {
//     await read();
//     bot.prefix = botconfig.prefix;
//     console.log(`${bot.user.username} is online!`);
//     bot.user.setActivity("Les Enfants du Paradis.", { type: 'WATCHING' });
// } );

// bot.on("message", async message => {
//     if (message.author.bot) return;
//     let prefix = bot.prefix;
//     let messageArray  = message.content.split(" ");
//     let cmd = messageArray[0];
//     let args = messageArray.slice(1);
//     if (message.channel.type === "dm") return;
//     if (message.content.startsWith(prefix)) {
//         let commandfile = bot.commands.get(cmd.slice(prefix.length));
//         if (commandfile) commandfile.run(bot, message, args);
//     } else {
//         if (message.mentions.has(bot.user) && !message.mentions.everyone) 
//             if (message.content.includes("Cine e"))
//                 return message.channel.send("Bostinaru Alex evident!");
//             return message.channel.send(`Am vazut ca mi-ai zis numele!\nStapanul meu <@!${message.author.id}>, daca vrei sa te ajut baga \`${bot.prefix}help\`.`);
//     }
// });

// bot.login(process.env.token);
