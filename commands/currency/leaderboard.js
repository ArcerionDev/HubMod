const _ = require('lodash')
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
module.exports = {
    name: "leaderboard",
    desc: "Get the Hub's bling leaderboard.",
    aliases: ['lb','leaderboard'],
    categories: ["currency"],
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
              
                let paginated = _.chunk(sorted, 10)
                function generateLbEmbed(arrnum) {

                    function getRankFromUid(id) {
                        for (let i = 0; i < sorted.length; i++) {
                            if (Object.keys(sorted[i])[0] === id) {
                                return i + 1;
                            }
                        }
                    }

                    let rank = null
                    for (let i = 0; i < sorted.length; i++) {
                        if (Object.keys(sorted[i])[0] === sender) { rank = i + 1 }
                    }
                    if (rank) {
                       rank = rank + (["st","nd","rd"][((rank+90)%100-10)%10-1]||"th")
                    }
                    let lbemd = new MessageEmbed()
                        .setTitle('Producer and Artist Hub Leaderboard')
                        .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
                        .setFooter(`${current+1}/${paginated.length}`)
                    let desc = `Your leaderboard rank: **${rank ? rank : 'N/A'}**\n\n`


                    if (!paginated[arrnum]) return message.reply({ content: ['An error occurred.'] })

                    for (let i = 0; i < paginated[arrnum].length; i++) {

                        let hasMatch = false

                        Array.from(users).forEach(u => {

                            if (u[0] === Object.keys(paginated[arrnum][i])[0]) {

                                hasMatch = true
                                desc = desc + `**#${getRankFromUid(Object.keys(paginated[arrnum][i])[0])}:** ${u[1].user.tag} ??? <:bling:693310674612387862> ${JSON.stringify(paginated[arrnum][i][Object.keys(paginated[arrnum][i])[0]]).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\n`

                            }

                        })

                        if (!hasMatch) { desc = desc + `**#${getRankFromUid(Object.keys(paginated[arrnum][i])[0])}:** ${Object.keys(paginated[arrnum][i])[0]} ??? <:bling:693310674612387862> ${JSON.stringify(paginated[arrnum][i][Object.keys(paginated[arrnum][i])[0]]).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}\n\n` }

                    }
                    lbemd.setDescription(desc)
                    return lbemd;
                }

                let prev = new MessageButton()
                    .setCustomId(`PreviousPage_${message.author.id}`)
                    .setLabel('Previous Page')
                    .setStyle('PRIMARY')

                prev.setDisabled(current === 0)

                let next = new MessageButton()
                    .setCustomId(`NextPage_${message.author.id}`)
                    .setLabel('Next Page')
                    .setStyle('PRIMARY')

                next.setDisabled(current === paginated.length - 1)

                let row = new MessageActionRow()
                    .addComponents(
                        prev,
                        next
                    );
                return message.channel.send({ embeds: [generateLbEmbed(current)], components: [row] })

            })
        })

    }
}