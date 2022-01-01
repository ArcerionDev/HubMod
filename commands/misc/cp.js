const fs = require('fs')
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const _ = require('lodash')
function makeid(r) { for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < r; n++)a += t.charAt(Math.floor(Math.random() * t.length)); return a }
module.exports = {

    name: "cp",
    desc: "Generate a custom poll for users to vote on.",
    aliases: ['custompoll','cp'],
    categories: [3],
    execute: function(client,message,args,db,prefix){

        message.reply({ embeds: [new MessageEmbed().setTitle('Enter the name for the poll below.').setDescription('Keep this to 150 characters or under.')] }).then(() => {
            const filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages({ filter, max: 1 })
                .then(name => {
                    let pollname = name.first().content
                    name.first().reply({ embeds: [new MessageEmbed().setTitle(`Alright, your poll name is ${pollname}.\n\nEnter the options to the poll below, separated by new lines.`).setDescription('```Option 1\nOption 2\nOption 3\nOption 4```')] }).then(() => {
                        const filter = m => m.author.id === message.author.id;
                        message.channel.awaitMessages({ filter, max: 1 })
                            .then(opts => {

                                opts = opts.first().content.split('\n')

                                if (opts.length < 2) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please provide at least 2 poll options.')] })

                                if (opts.length > 25) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('You can include up to 25 poll options.')] })

                                let hasDupe = false

                                let count = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

                                opts.forEach(o => {

                                    if (count(opts, o) > 1) {

                                        hasDupe = true;

                                    }

                                })

                                if (hasDupe) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please make sure that all the poll options are different.')] })

                                let hasLarge = false;

                                opts.forEach(o => {

                                    if (o.length > 80) { hasLarge = true }

                                })

                                if (hasLarge) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please make sure your options are all under 80 characters.')] })

                                // that covers all the obvious stuff I think


                                let split = _.chunk(opts, 5)

                                let id = makeid(10)

                                let rows = []

                                split.forEach(r => {

                                    let optrow = new MessageActionRow()

                                    r.forEach(e => {

                                        optrow.addComponents(

                                            new MessageButton()
                                                .setCustomId(`${id}_${opts.findIndex((i) => i === e) + 1}`)
                                                .setLabel(e)
                                                .setStyle('PRIMARY')

                                        )

                                    })

                                    rows.push(optrow)

                                })
                                //  console.log(JSON.stringify(rows))

                                let toSubmit = {}

                                toSubmit.id = id;

                                toSubmit.name = pollname

                                toSubmit.options = opts;

                                toSubmit.votes = {}

                                toSubmit.creator = message.author.tag

                                opts.forEach((e, index) => {

                                    toSubmit.votes[JSON.stringify(index + 1)] = []
                                    //  console.log(JSON.stringify(index+1))

                                })

                                fs.writeFileSync(`./data/custompolls/${id}.json`, JSON.stringify(toSubmit))

                                message.channel.bulkDelete(3)

                                message.channel.send({ embeds: [new MessageEmbed().setTitle(pollname).setDescription(`Created by ${message.author.tag}.\n\nPress one of the options below to cast your vote.`).setFooter(`Poll ID is ${id}. Mods or the poll creator can execute ${prefix}endcustom ${id} / ${prefix}ec ${id} to end it and show the results.`)], components: rows })

                            })
                    })
                })
        })

    }

}