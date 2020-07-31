const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
const superagent = require("superagent");
const CoronaRole = "CoronaPoll Mod";
var channelVar;

let coronaJson = JSON.parse(fs.readFileSync("./coronapoll.json", "utf8"));
let botconfig = JSON.parse(fs.readFileSync("./botconfig.json", "utf8"));

function makeEmbedList(bot, embed) {
    embed.setTitle('CoronaPoll Leaderboard')
        .setColor(0xf3f5c1);
    let players = "";
    let scores = "";
    
    for(var id in coronaJson.users) {
        players += `${bot.users.cache.get(id)}`  + '\n';
        scores += coronaJson.users[id]['wins']  + '\n';
    }

    embed.addFields( 
        { name: "Players", value: players, inline: true },
        { name: "Score", value: scores, inline: true },
    );

    return embed;
}

function updateJSON() {
    fs.writeFile("./coronapoll.json", JSON.stringify(coronaJson), (err) => {
        if (err) console.log(err);
    });
}

function generateNewsEmbed(body) {
    if (!body.todayCases) body.todayCases = "N/A";
    if (!body.cases) body.cases = "N/A";
    if (!body.totalTests) body.totalTests = "N/A";
    if (!body.active) body.active = "N/A";
    if (!body.todayDeaths) body.todayDeaths = "N/A";
    let embed = new Discord.MessageEmbed()
    .setTitle(`COVID-19 News from ${body.country}`)
    .setColor(0xf3f5c1)
    .setThumbnail('https://i.imgur.com/NoSIihA.jpg')
    .addFields({
        name: '🤧 Cazuri noi',
        value: '\`' + body.todayCases + '\`',
        inline: true
    },
    {
        name: '🤒 Total cazuri',
        value: '\`' + body.cases + '\`',
        inline: true
    },
    {
        name: '🧪 Total teste',
        value: '\`' + body.totalTests + '\`',
        inline: true
    },
    {
        name: '🦠 Cazuri active',
        value: '\`' + body.active + '\`',
        inline: true
    },
    {
        name: '💀 Decese noi',
        value: '\`' + body.todayDeaths + '\`',
        inline: true
    });
    return embed;
}

function checkForCoronaUpdate(bot) {
    setInterval(async function() {
        let {body} = await superagent 
            .get(`https://coronavirus-19-api.herokuapp.com/countries/Romania`);
        if (body.cases > coronaJson.cases) {
            let ch = bot.channels.cache.get(channelVar.id);
            if (ch) {
                ch.send(generateNewsEmbed(body));
                ch.send(generateWinnerEmbed(bot, body.todayCases));
                coronaJson.cases = body.cases;
                updateJSON();
            }
        }
    }, ms('30m'));
}

function generateWinnerEmbed(bot, todayCases) {
    let diff = 99999;
    let winner = 'random_id';
    for(var id in coronaJson.users) {
        if ( coronaJson.users[id]['bet'] != '0' && 
            Math.abs(coronaJson.users[id]['bet'] - todayCases)  < diff)
        {
            diff = Math.abs(coronaJson.users[id]['bet'] - todayCases);
            winner = id;
        }
    }

    let embed = new Discord.MessageEmbed();
    if (winner === 'random_id') return makeEmbedList(bot, embed);
    
    var winnerVal =  coronaJson.users[id]['bet'];
    var winners = "";
    for(var id in coronaJson.users) {
        if ( coronaJson.users[id]['bet'] === winnerVal) {
            winners += `${bot.users.cache.get(id)} cu ${winnerVal}\n`;
            coronaJson.users[id]['wins']++;
            coronaJson.users[id]['bet'] = 0;
        } else {
            coronaJson.users[id]['bet'] = 0;
        }
    }

    embed.addFields( {name: 'Winner', value: winners, inline: false });

    fs.writeFile("./coronapoll.json", JSON.stringify(coronaJson), (err) => {
        if (err) console.log(err);
    });

    return makeEmbedList(bot, embed);
}

module.exports.init = async (bot) => { 
    console.log("coronaJSON read.");
    channelVar = bot.guilds.cache.get(botconfig.guild).channels.cache.find(ch => ch.id == coronaJson.channelId);

    if (!channelVar) {
        channelVar = bot.guilds.cache.get(botconfig.guild).channels.cache.find(ch => ch.rawPosition == 0 && ch.deleted == false && ch.type == 'text');
        coronaJson.channelId = channelVar.id;
        updateJSON();
    }

    checkForCoronaUpdate(bot);
}

module.exports.run =  async (bot, message, args) => {
    if (args[0] == 'bet') {
        message.delete();
        if (!args[1])
            message.channel.send(`Trebuie sa zici pe ce numar pariezi. \`${bot.prefix}corona bet <numar_cazuri>\`.`);
        else {
            if (args[1] <= 0 || args[1] > 99999 || isNaN(args[1])) 
                return message.author.send(`Poti paria doar pe un numar de la **1** la **99999** de cazuri.`);
            if (!coronaJson['users'][message.author.id]) {
                coronaJson['users'][message.author.id] = {
                    bet: args[1],
                    wins: 0
                };
            } else {
                coronaJson['users'][message.author.id]['bet'] = args[1];
            }
            message.author.send(`Ti-am adaugat pariul de **${args[1]}** de cazuri.`);
            message.channel.send(`@here <@!${message.author.id}> a adaugat un pariu.`);
            updateJSON();
        }
    } else if (args[0] == 'scores') {
        return message.channel.send(makeEmbedList(bot, new Discord.MessageEmbed()));
    } else if (args[0] == 'set_channel') {
        channelVar = message.channel;
        coronaJson.channelId = channelVar.id;
        updateJSON();
        return message.channel.send(`Noul canal pe care voi posta noutatile este: ${channelVar.name}.`);
    } else if (args[0] == 'get_news') {
        if (!args[1]) return message.channel.send(`Trebuie sa zici ce tara doresti.\n\`example: ${bot.prefix}corona get_news Romania\`.`);
        let {body} = await superagent 
            .get(`https://coronavirus-19-api.herokuapp.com/countries/${args[1]}`);
        return message.channel.send(generateNewsEmbed(body));
    } else if (args[0] == 'get_countries') {
        let {body} = await superagent 
            .get(`https://coronavirus-19-api.herokuapp.com/countries`);
        let countries = "";
        body.forEach(x => countries += x.country + " ");
        let embed = new Discord.MessageEmbed()
            .setTitle("Tari disponibile")
            .setDescription(countries);
        return message.channel.send(embed);
    } else {
        return message.channel.send(`Scuze nu am inteles: \`${bot.prefix}help corona\`.`);
    }
}

module.exports.help = {
    name: "corona"
}