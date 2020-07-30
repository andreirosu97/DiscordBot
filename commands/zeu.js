const Discord = require("discord.js");

module.exports.init = async (bot) => { }

module.exports.run =  async (bot, message, args) => {
    const embed = new Discord.MessageEmbed();
    if (args[0] == 'clear') {
        if (!args[1]) return message.channel.send(`Foloseste asa sefule: \`${bot.prefix}zeu clear <nr_lines>\`.`);
        message.channel.bulkDelete(args[1]);
    } else if (args[0] == 'clear50') {
        message.channel.bulkDelete(50);
    } else {
        return message.channel.send(`Scuze nu am inteles: \`${bot.prefix}help zeu\`.`);
    }
}

module.exports.help = {
    name: "zeu"
}