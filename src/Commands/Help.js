const Command = require('../Structures/Command.js');
const { MessageEmbed } =  require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['h']
        })
    }

    async run(message, [command]) {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true}))
            .setThumbnail(this.client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true}))
            .setTimestamp();

        if (command) {
            const cmd = this.client.commands.get(command) || this.client.commands.get(this.aliases.get(command));

            if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

            embed.setAuthor(`${this.client.utils.capitalise(cmd.name)} Command Help`, this.client.user.displayAvatarURL());
            embed.setDescription([
                `➔ Aliases: ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No Aliases'}`,
                `➔ Description: ${cmd.description}`,
                `➔ Category: ${cmd.category}`,
                `➔ Usage: ${cmd.usage}`,
            ]);

            return message.channel.send(embed);
        } else {
            embed.setDescription([
                `These are the available commands for ${message.guild.name}.`,
                `This bot's prefix is: ${this.client.prefix}.`,
                `Command Parameters: \`<>\` is strict \`[]\` is optional.`
            ]);
            let categories;
            if (!this.client.owners.includes(message.author.id)) {
                categories = this.client.utils.removeDuplicates(this.client.commands.filter(cmd => cmd.category !== 'Owners').map(cmd => cmd.category));
            } else {
                categories = this.client.utils.removeDuplicates(this.client.commands.map(cmd => cmd.category));
            }

            for (const category of categories) {
                embed.addField(`**${this.client.utils.capitalise(category)}**`, this.client.commands.filter(cmd =>
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
            }
            return message.channel.send(embed);
        }
        // const embed = new MessageEmbed();
        // if (args[0] == 'corona') {
        //     embed.setTitle('Zeul\'s Corona Commands')
        //     .setColor(0xf3f5c1)
        //     .setDescription('Commands for the corona poll.')
        //     .setThumbnail('https://i.imgur.com/NoSIihA.jpg')
        //     .addFields( 
        //         { name: 'Set your prediction', value: '`' + this.client.prefix + 'corona bet [prediction]`', inline: false },
        //         { name: 'See leaderboard', value: '`' + this.client.prefix + 'corona scores`', inline: true },
        //         { name: 'Set updates channel', value: '`' + this.client.prefix + 'corona set_channel`', inline: true },
        //         { name: 'See available countries', value: '`' + this.client.prefix + 'corona countries`', inline: false },
        //         { name: 'See news for country', value: '`' + this.client.prefix + 'corona get_news [country]`', inline: true }
        //     ); 
        // } if (args[0] == 'zeu') {
        //     embed.setTitle('Zeul\'s Admin Commands')
        //     .setColor(0xf3f5c1)
        //     .setDescription('Commands for the corona poll.')
        //     .addFields( 
        //         { name: 'Clear lines', value: '`' + this.client.prefix + 'zeu clear [number of lines]`', inline: false }
        //     ); 
        // } else {
        //     embed.setTitle('Zeul\'s Help Commands')
        //     .setColor(0xf3f5c1)
        //     .setDescription('General help commands.')
        //     .setThumbnail(this.client.user.avatarURL())
        //     .addFields( 
        //         { name: 'CoronaPoll', value: '`' + this.client.prefix + 'help corona`', inline: true },
        //         { name: 'Romanian music', value: '`' + this.client.prefix + 'help manele`', inline: true },
        //         { name: 'Misc commands', value: '`' + this.client.prefix + 'help zeu`', inline: true }
        //     );
        // }
        // message.channel.send(embed);
    }
};