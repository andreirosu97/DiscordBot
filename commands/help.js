const Discord = require("discord.js");

module.exports.init = async (bot) => { }

module.exports.run =  async (bot, message, args) => {
    const embed = new Discord.MessageEmbed();
    if (args[0] == 'corona') {
        embed.setTitle('Zeul\' Corona Commands')
        .setColor(0xf3f5c1)
        .setDescription('Commands for the corona poll.')
        .setThumbnail('https://i.imgur.com/NoSIihA.jpg')
        .addFields( 
            { name: 'Pariaza', value: '`' + bot.prefix + 'corona bet <nr_cazuri>`', inline: true },
            { name: 'Vezi scoruri', value: '`' + bot.prefix + 'corona scores`', inline: true },
            { name: 'Seteaza canal', value: '`' + bot.prefix + 'corona set_channel`', inline: true },
        ); 
    } else {
        embed.setTitle('Zeul Commands')
        .setColor(0xf3f5c1)
        .setDescription('Salut eu sunt Zeul, uite ce stiu sa fac.')
        .setThumbnail(bot.user.avatarURL())
        .addFields( 
            { name: 'Corona poll', value: '`' + bot.prefix + 'help corona`', inline: true },
            { name: 'Manele iz laif', value: '`' + bot.prefix + 'help manele`', inline: true },
            { name: 'Dau cu banu', value: '`' + bot.prefix + 'help gamble`', inline: false },
        );
    }
    message.channel.send(embed);
}

module.exports.help = {
    name: "help"
}