const fs = require('fs')
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "ec",
    desc: "End a custom poll. Only usable by moderators and the creator of the poll.",
    aliases: ['endcustom','ec'],
    input: ['ID'],
    categories: [3],
    execute: function(client,message,args,db,prefix){
        args = message.content.split(' ')
        message.guild.members.fetch(message.author.id).then(u => {
            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription("Provide a poll ID to end.")] })

            if (!fs.existsSync(`./data/custompolls/${args[1]}.json`)) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription("Invalid poll ID. It may have ended or never existed.")] })

            let data = JSON.parse(fs.readFileSync(`./data/custompolls/${args[1]}.json`, 'utf8'))

            if (message.author.tag === data.creator) {
                let results = []

                Object.keys(data.votes).forEach(v => {
                    results.push(data.votes[v].length)
                })

                let preserved = results.slice(0);

                let winners = []

                let wn = results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)]

                if (wn === 0) {

                    message.channel.send({ embeds: [new MessageEmbed().setTitle('Results').setDescription('The vote has ended, but nobody voted :(')] })

                } else {

                    while (results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)] === wn) {

                        winners.push(data.options[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)])

                        results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)] = -1

                    }


                    message.channel.send({ embeds: [new MessageEmbed().setTitle(`Results for poll ${data.name}`).setDescription(`The poll ${winners.length > 1 ? 'winners are: ' : 'winner is'}\n\n **${winners.join(', ')}**\n\nSubmitted by ${data.creator}.`).setImage(`https://quickchart.io/chart?c={type:'pie',data:{labels:${JSON.stringify(data.options)},datasets:[{data:${JSON.stringify(preserved)}}]}}`).setFooter(`Poll ID: ${data.id} • Bot developed by Arcerion#7298 🖤`)] })

                }

                fs.unlinkSync(`./data/custompolls/${args[1]}.json`)


            } else {

                if (!u.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription("You don't have permission to execute this command.")] })
                let results = []

                Object.keys(data.votes).forEach(v => {
                    results.push(data.votes[v].length)
                })

                let preserved = results.slice(0);

                let winners = []

                let wn = results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)]

                if (wn === 0) {

                    message.channel.send({ embeds: [new MessageEmbed().setTitle('Results').setDescription('The vote has ended, but nobody voted :(')] })

                } else {

                    while (results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)] === wn) {

                        winners.push(data.options[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)])

                        results[results.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0)] = -1

                    }

                    console.log(`https://quickchart.io/chart?c={type:'pie',data:{labels:${JSON.stringify(data.options)},datasets:[{data:${JSON.stringify(preserved)}}]}}`)

                    message.channel.send({ embeds: [new MessageEmbed().setTitle(`Results for poll ${data.name}`).setDescription(`The poll ${winners.length > 1 ? 'winners are: ' : 'winner is'}\n\n **${winners.join(', ')}**\n\nSubmitted by ${data.creator}.`).setImage(`https://quickchart.io/chart?c={type:'pie',data:{labels:${JSON.stringify(data.options)},datasets:[{data:${JSON.stringify(preserved)}}]}}`).setFooter(`Poll ID: ${data.id} • Bot developed by Arcerion#7298 🖤`)] })

                }

                fs.unlinkSync(`./data/custompolls/${args[1]}.json`)

            }
        })
    }
}