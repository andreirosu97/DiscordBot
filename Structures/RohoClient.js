const { Client } = require('discord.js');

module.exports = class RohoClient extends Client {
    
    constructor(options = {}) {
        super({
            disableMentions: 'everyone'
        });
        this.validate(options);

        this.once('ready', () => {
            console.log(`Logged in as ${this.user.username}`);
        });

        this.on('message', async (message) => {
            const mensionRegex = RegEx(`^<@!${this.user.id}>$`);
            const mensionRegexPrefix = RegEx(`^<@!${this.user.id}>`);

            if (!message.guild || message.author.bot) return;

            if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.prefix}\`.`);

            const prefix = message.content.match(mentionRegexPrefix) ? 
                message.content.match(mentionRegexPrefix)[0] : this.prefix;

            
            const [cmd, ...args] =  message.content.slice(prefix.length).trim().split(/ +/g);
        });
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');

        if (!options.prefix) throw new Error('You must pass a prefix for the client.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.prefix;
    }

    async login() {
        super.login(process.env.token);
    }
}