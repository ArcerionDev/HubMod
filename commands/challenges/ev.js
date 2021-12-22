const fs = require('fs')
const {MessageEmbed} = require('discord.js');
module.exports = {

    name: "ev",
    desc: "End the server challenge vote, if one's in progress. Only usable by moderators.",
    aliases: ['endvote','ev'],
    categories: [0],
    execute: function(client,message,args,db,prefix){
        
        message.guild.members.fetch(message.author.id).then(fetchUser => {

            if (message.channel.id != db.channels.ccvote) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`That command can only be executed in <#${db.channels.ccvote}>.`)] })

            if (fetchUser.permissions.has('32') || message.author.id === "683792601219989601") {

                if (!db.votes.inprogress) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('A vote is yet to start, use `'+prefix+'startvote / '+prefix+'sv` to start one.')] })

                let results = []

                Object.keys(db.votes.votes).forEach(v => {
                    results.push(db.votes.votes[v].length)
                })


                let winner = results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)

                if (results[winner] === 0) { message.channel.send({ embeds: [new MessageEmbed().setTitle('Results').setDescription('The vote has ended, but nobody voted :(')] }) } else {


                    let hasTied = [], i;
                    for (i = 0; i < results.length; i++)
                        if (results[i] === results[winner])
                            hasTied.push(i);

                    switch (hasTied.length) {

                        case 1:

                            let winningchal = db.votes.challenges[0][winner]

                            message.channel.send({ embeds: [new MessageEmbed().setTitle('Results').setDescription(`The vote has ended.\n\nThe majority voted for option **${winner + 1}**, which got **${results[winner]}** vote(s).`).addField(`${winningchal[0]} • Team members - ${winningchal[2]}`, `${winningchal[1]} • Submitted by ${winningchal[3]}`, false).setFooter(`Results • Option 1: ${results[0]} vote(s) | Option 2: ${results[1]} vote(s) | Option 3: ${results[2]} vote(s)`).setTimestamp()] })
                            break;
                        case 2:

                            let tied2 = new MessageEmbed()
                                .setTitle('Results')
                                .setDescription(`The vote has ended.\n\nThe end result is a two way tie of option **${hasTied[0] + 1}** and option **${hasTied[1] + 1}**, which each got **${results[winner]}** vote(s).`)
                                .setFooter(`Results • Option 1: ${results[0]} vote(s) | Option 2: ${results[1]} vote(s) | Option 3: ${results[2]} vote(s)`).setTimestamp()

                            hasTied.forEach(e => {
                                tied2.addField(`${db.votes.challenges[0][e][0]} • Team members - ${db.votes.challenges[0][e][2]}`, `${db.votes.challenges[0][e][1]} • Submitted by ${db.votes.challenges[0][e][3]}`, false)
                            })

                            message.channel.send({ embeds: [tied2] })
                            break;
                        case 3:

                            let tied3 = new MessageEmbed()
                                .setTitle('Results')
                                .setDescription(`The vote has ended.\n\nThe end result is a three(!) way tie of all options, which all got **${results[winner]}** vote(s).`)
                                .setFooter(`Results • Option 1: ${results[0]} vote(s) | Option 2: ${results[1]} vote(s) | Option 3: ${results[2]} vote(s)`).setTimestamp()

                            hasTied.forEach(e => {
                                tied3.addField(`${db.votes.challenges[0][e][0]} • Team members - ${db.votes.challenges[0][e][2]}`, `${db.votes.challenges[0][e][1]} • Submitted by ${db.votes.challenges[0][e][3]}`, false)
                            })

                            message.channel.send({ embeds: [tied3] })
                            break;
                    }

                }
                db.votes.challenges = []

                db.votes.votes = { "1": [], "2": [], "3": [] }

                db.votes.inprogress = false

                fs.writeFileSync('./data/votes.json', JSON.stringify(db.votes))


            } else {
                return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })
            }

        })

    }
}