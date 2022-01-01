const fs = require('fs')

const {MessageEmbed} = require('discord.js');

let cpids = fs.readdirSync('./data/custompolls/').slice(0)

cpids.forEach((i,index) => {

    cpids[index] = i.replace('.json','')

})

module.exports = {

    customids: cpids,

    execute: function(client,interaction,db,prefix){

            let parsed = interaction.customId.split('_')

            if (parsed.length != 2) return; // this should never happen

            let selectedId = parsed[0]

            let selectedOpt = parsed[1]

            if (!fs.existsSync(`./data/custompolls/${selectedId}.json`)) return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Invalid poll. It may have ended or never existed.",
                        flags: 64,
                    }
                }
            }).catch(error => { console.log(error) })

            let data = JSON.parse(fs.readFileSync(`./data/custompolls/${selectedId}.json`, 'utf8'))

            let hasVoted = false;

            Object.keys(data.votes).forEach(e => {
                if (data.votes[e].includes(interaction.user.id)) {
                    hasVoted = e

                }
            })

            if (hasVoted) {

                delete data.votes[hasVoted][data.votes[hasVoted].indexOf(interaction.user.id)]

                data.votes[hasVoted] = data.votes[hasVoted].filter(Boolean)

            }

            data.votes[selectedOpt].push(interaction.user.id)

            fs.writeFileSync(`./data/custompolls/${selectedId}.json`, JSON.stringify(data))

            return client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`${hasVoted ? 'Recasted' : "Casted"} your vote for **${data.options[selectedOpt - 1]}**.`)],
                        flags: 64,
                    }
                }
            }).catch(error => { console.log(error) })


    }

}