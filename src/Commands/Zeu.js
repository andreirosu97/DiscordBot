const Command = require('../Structures/Command.js');
const { MessageEmbed } =  require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['z']
        })
    }

    async run(message, args) {
        const embed = new MessageEmbed();
        if (args[0] == 'clear') {
            if (!args[1]) return message.channel.send(`Foloseste asa sefule: \`${this.client.prefix}zeu clear <nr_lines>\`.`);
            return message.channel.bulkDelete(args[1]);
        } else {
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(`${message.guild.name} Zeu Menu`, message.guild.iconURL({ dynamic: true}))
                .setThumbnail(this.client.user.displayAvatarURL())
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true}))
                .setTimestamp();
            embed.setDescription([
                `➔ \`${this.client.prefix}${this.name} clear <nr lines>\``
            ]);
            return message.channel.send(embed);
        }
    }

};