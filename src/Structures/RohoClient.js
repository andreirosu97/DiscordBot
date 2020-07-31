const { Client, Collection } = require('discord.js');
const Util = require('./Utils.js');
const fs = require('fs');

module.exports = class RohoClient extends Client {
    
    constructor(options = {}) {
        super({
            disableMentions: 'everyone'
        });
        this.validate(options);

        this.commands = new Collection(); 
        
        this.aliases = new Collection(); 
        
        this.utils = new Util(this); 

        this.owners = options.owners;

        this.config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

        this.once('ready', () => {
            console.log(`Logged in as ${this.user.username}.`);
            this.user.setActivity("Gay porn.", { type: 'WATCHING' });
        });

        this.on('message', async (message) => {
            const mentionRegex = RegExp(`^<@!${this.user.id}>$`);
            const mentionRegexPrefix = RegExp(`^<@!${this.user.id}>`);

            if (!message.guild || message.author.bot) return;

            if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is \`${this.prefix}\`.`);

            const prefix = message.content.match(mentionRegexPrefix) ? 
                message.content.match(mentionRegexPrefix)[0] : this.prefix;

            // eslint-disable-next-line no-unused-vars
            if (!message.content.startsWith(prefix)) return;
            const [cmd, ...args] =  message.content.slice(prefix.length).trim().split(/ +/g);

            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()));
            if (command) {
                command.run(message, args);
            }
        });
    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
        if (!options.prefix) throw new Error('You must pass a prefix for the client.');
        if (typeof options.prefix !== 'string') throw new TypeError('Prefix should be a type of String.');
        this.prefix = options.prefix;
    }

    async start() {
        this.utils.loadCommands();
        super.login(process.env.token);
        //super.login("NzM4MTU3NDk0MTQ4Mzk5MTQ3.XyH0vA.a3jEatIbm5irGvWUuZEG1fs3Rz8");
    }

    updateConfig() {
        this.config.prefix = this.prefix;
        this.config.token = this.token;
        this.config.version = this.version;
        fs.writeFile('./config.json', JSON.stringify(this.config), (err) => {
            if (err) console.log(err);
        });
    }
};