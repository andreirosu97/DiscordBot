const Discord = require("discord.js");
const fs = require('fs');
let botconfig = JSON.parse(fs.readFileSync("./botconfig.json", "utf8"));

module.exports.init = async (bot) => { }

module.exports.run =  async (bot, message, args) => {
    const embed = new Discord.MessageEmbed();
    if (args[0] == 'prefix') {
        if (args[1]) {
            bot.prefix = args[1];
            botconfig.prefix = bot.prefix;
            fs.writeFile("./botconfig.json", JSON.stringify(botconfig), (err) => {
                if (err) console.log(err);
            });
            message.channel.send(`Prefix changed to ${bot.prefix}`);
        } else {
            message.channel.send(`Try like this: ${bot.prefix}settings prefix [New Prefix]`);
            return;
        }
    }
}

module.exports.help = {
    name: "settings"
}