const _ = require('lodash')
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
module.exports = {
    name: "lb",
    desc: "Get the Hub's bling leaderboard.",
    aliases: ['lb','leaderboard'],
    categories: [1],
    execute: function(client,message,args,db,prefix){

        message.guild.members.fetch(message.author.id).then(fetchUser => {
            var sender = fetchUser.id
            message.guild.members.fetch().then(users => {

                let current = 0
                let blingarr = [];
                Object.keys(db.blingdata).forEach(e => {
                    let data = {}
                    data[e] = db.blingdata[e]
                    blingarr.push(data)
                });
                let sorted = blingarr.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
                function getRankFromUid(id) {
                    for (let i = 0; i < sorted.length; i++) {
                        if (Object.keys(sorted[i])[0] === id) {
                            return i + 1;
                        }
                    }
                }
                let paginated = _.chunk(sorted, 10)
                function generateLbEmbed(arrnum, identity) {
                    let rank = null
                    for (let i = 0; i < sorted.length; i++) {
                        if (Object.keys(sorted[i])[0] === sender) { rank = i + 1 }
                    }
                    if (rank) {
                        if(rank.length > 1){
                            if(JSON.stringify(rank).charAt(JSON.stringify(rank).length-2) === 1){
                                rank = JSON.stringify(rank) + "th"
                            }else{

                                switch (JSON.stringify(rank).slice(-1)) {
                                    case '1':
                                        rank = JSON.stringify(rank) + "st"
                                        break;
                                    case '2':
                                        rank = JSON.stringify(rank) + "nd"
                                        break;
                                    case '3':
                                        rank = JSON.stringify(rank) + "rd"
                                        break;
                                    default:
                                        rank = JSON.stringify(rank) + "th"
                                        break;
                                }

                            }
                        }
                    }
                    let lbemd = new MessageEmbed()
                        .setTitle('Producer and Artist Hub Leaderboard')
                        .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')

                    lbemd.setFooter(`Requested by ${identity}`)
                    let desc = `Your leaderboard rank: **${rank ? rank : 'N/A'}**\n\n`


                    if (!paginated[arrnum]) return message.reply({ content: ['An error occurred.'] })

                    for (let i = 0; i < paginated[arrnum].length; i++) {

                        let hasMatch = false

                        Array.from(users).forEach(u => {

                            if (u[0] === Object.keys(paginated[arrnum][i])[0]) {

                                hasMatch = true
                                desc = desc + `**#${getRankFromUid(Object.keys(paginated[arrnum][i])[0])}:** ${u[1].user.tag} • <:bling:693310674612387862> ${paginated[arrnum][i][Object.keys(paginated[arrnum][i])[0]]}\n\n`

                            }

                        })

                        if (!hasMatch) { desc = desc + `**#${getRankFromUid(Object.keys(paginated[arrnum][i])[0])}:** ${Object.keys(paginated[arrnum][i])[0]} • <:bling:693310674612387862> ${paginated[arrnum][i][Object.keys(paginated[arrnum][i])[0]]}\n\n` }

                    }
                    lbemd.setDescription(desc)
                    return lbemd;
                }

                let prev = new MessageButton()
                    .setCustomId('PreviousPage')
                    .setLabel('Previous Page')
                    .setStyle('PRIMARY')

                prev.setDisabled(current === 0)

                let next = new MessageButton()
                    .setCustomId('NextPage')
                    .setLabel('Next Page')
                    .setStyle('PRIMARY')

                next.setDisabled(current === paginated.length - 1)

                let row = new MessageActionRow()
                    .addComponents(
                        prev,
                        next
                    );
                return message.channel.send({ embeds: [generateLbEmbed(current, message.author.tag)], components: [row] }).then(() => {

                    client.on('interactionCreate', async interaction => {
                        if (interaction.customId === "NextPage") {
                            // god forgive me for this
                            if (interaction.user.tag != interaction.message.embeds[0].footer.text.split('Requested by ')[1]) {

                                return client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            content: "It's not your message.",
                                            flags: 64,
                                        }
                                    }
                                }).catch(e => { console.log(e) })

                            }
                            interaction.deferUpdate().catch(e => { console.log(e) })

                            current++
                            row.components[0].setDisabled(current === 0)
                            row.components[1].setDisabled(current === paginated.length - 1)

                            return interaction.message.edit({ embeds: [generateLbEmbed(current, interaction.user.tag)], components: [row] }).catch(e => { console.log(e) })
                        }
                        if (interaction.customId === "PreviousPage") {
                            if (interaction.user.tag != interaction.message.embeds[0].footer.text.split('Requested by ')[1]) {

                                return client.api.interactions(interaction.id, interaction.token).callback.post({
                                    data: {
                                        type: 4,
                                        data: {
                                            content: "It's not your message.",
                                            flags: 64,
                                        }
                                    }
                                }).catch(e => { console.log(e) })

                            }
                            interaction.deferUpdate().catch(e => { console.log(e) })
                            current--
                            row.components[0].setDisabled(current === 0)
                            row.components[1].setDisabled(current === paginated.length - 1)
                            return interaction.message.edit({ embeds: [generateLbEmbed(current, interaction.user.tag)], components: [row] }).catch(e => { console.log(e) })
                        }

                    })

                })





            })
        })

    }
}