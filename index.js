const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton, DiscordAPIError, Message, Collection } = require('discord.js');
const _ = require('lodash')
const fs = require('fs');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.DIRECT_MESSAGES] });
client.commands = new Collection();
const commandFolders = fs.readdirSync('./commands/')
for (const folder of commandFolders) {

    if (!folder.endsWith('.js')) {

        let commandFiles = fs.readdirSync(`./commands/${folder}/`);

        for (let command of commandFiles) {

            command = require(`./commands/${folder}/${command}`)

            client.commands.set(command.name, command)

        }

    }

}

module.exports.commands = client.commands

const prefix = require('./config.json').prefix
require('./utils/handleErrors')(client)

let db = {}
db.blingdata = JSON.parse(fs.readFileSync('./data/currencystore.json', 'utf-8'))
db.channels = JSON.parse(fs.readFileSync('./data/channels.json', 'utf-8'))
db.ccs = JSON.parse(fs.readFileSync('./data/communitychallenges.json', 'utf-8'))
db.roles = JSON.parse(fs.readFileSync('./data/roles.json', 'utf-8'))
db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
db.queue = JSON.parse(fs.readFileSync('./data/queue.json', 'utf-8'))
db.spqueue = JSON.parse(fs.readFileSync('./data/spqueue.json', 'utf8'))
db.samplepacks = JSON.parse(fs.readFileSync('./data/samplepacks.json', 'utf8'))
module.exports.db = db
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(`${prefix}help | Developed by Arcerion#7298`, 'PLAYING')
})
client.on('messageReactionAdd', (reaction,user) => {

    require(`./utils/dailyBling`)(client,reaction, db, prefix,user)

});
let cooldown = []
client.on('message', async message => {
    try {
        db.blingdata = JSON.parse(fs.readFileSync('./data/currencystore.json', 'utf-8'))
        db.channels = JSON.parse(fs.readFileSync('./data/channels.json', 'utf-8'))
        db.ccs = JSON.parse(fs.readFileSync('./data/communitychallenges.json', 'utf-8'))
        db.roles = JSON.parse(fs.readFileSync('./data/roles.json', 'utf-8'))
        db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
        db.queue = JSON.parse(fs.readFileSync('./data/queue.json', 'utf-8'))
        db.spqueue = JSON.parse(fs.readFileSync('./data/spqueue.json', 'utf8'))
        db.samplepacks = JSON.parse(fs.readFileSync('./data/samplepacks.json', 'utf8'))
        let args = message.content.toLowerCase().split(' ')
        if (message.channelId === db.channels.spotlight) {
            message.guild.members.fetch(message.author.id).then(x => {
                if (x._roles.includes(db.roles.spotlight)) {
                    message.channel.send(`<@&${db.roles.spotlightping}>`)
                    x.roles.remove(db.roles.spotlight)
                }
            })

        }
        if (message.author.bot) return;

        if (cooldown.includes(message.author.id)) {
        } else {
            if (db.blingdata[message.author.id]) {
                db.blingdata[message.author.id] = db.blingdata[message.author.id] + (Math.round(Math.random() * 5) + 5)
                cooldown.push(message.author.id)
                setTimeout(function () {
                    delete cooldown[cooldown.indexOf(message.author.id)]
                    cooldown = cooldown.filter(Boolean)
                }, 30000)
            } else {
                db.blingdata[message.author.id] = (Math.round(Math.random() * 5) + 5)
            }
        }
        fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type != 'GUILD_TEXT') return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please execute this command in a server text channel.')] })
        let command;
        Array.from(client.commands).forEach(c => {
            if (c[1].aliases.includes(args[0].slice(1))) {
                command = c[1]
            }
        })
        if (!command) return;
        command.execute(client, message, args, db, prefix)
    } catch (e) {
        console.log(e)
    }

    module.exports.db = db

})

client.on('interactionCreate', async interaction => {
    try {
        db.blingdata = JSON.parse(fs.readFileSync('./data/currencystore.json', 'utf-8'))
        db.channels = JSON.parse(fs.readFileSync('./data/channels.json', 'utf-8'))
        db.ccs = JSON.parse(fs.readFileSync('./data/communitychallenges.json', 'utf-8'))
        db.roles = JSON.parse(fs.readFileSync('./data/roles.json', 'utf-8'))
        db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
        db.queue = JSON.parse(fs.readFileSync('./data/queue.json', 'utf-8'))
        db.spqueue = JSON.parse(fs.readFileSync('./data/spqueue.json', 'utf8'))
        db.samplepacks = JSON.parse(fs.readFileSync('./data/samplepacks.json', 'utf8'))

        let parsed = interaction.customId.split('_')

        let interactionName = parsed[0]

        let interactions = fs.readdirSync('./interactions/')

        let correctinteraction = null;

        interactions.forEach(i => {

            let customids = require(`./interactions/${i}`).customids

            if (customids.includes(interactionName)) {

                correctinteraction = require(`./interactions/${i}`)

            }

        })

        if (correctinteraction) {

            correctinteraction.execute(client, interaction, db, prefix)

        }

    } catch (e) {
        console.log(e)
    }
})

client.login(require('./config.json').token)