const Command = require('../Structures/Command.js');
const { MessageEmbed } =  require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
        })
    }

    async run(message, args) {
        if (args[0] == 'prefix') {
            if (args[1]) {
                this.client.prefix = args[1];
                this.client.updateConfig();
                return message.channel.send(`Prefix changed to ${args[1]}`);
            }
        } else {
            const embed = new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(`${message.guild.name} Settings Menu`, message.guild.iconURL({ dynamic: true}))
                .setThumbnail(this.client.user.displayAvatarURL())
                .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true}))
                .setTimestamp();
            embed.setDescription([
                `➔ \`${this.client.prefix}${this.name} prefix <new prefix>\``
            ]);
            return message.channel.send(embed);
        }
    }
};