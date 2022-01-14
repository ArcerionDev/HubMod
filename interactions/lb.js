const fs = require('fs')
const {MessageEmbed} = require('discord.js');
const _ = require('lodash')

module.exports = {

    customids: ['NextPage','PreviousPage'],

    execute: function(client,interaction,db,prefix){

        let current = parseInt(interaction.message.embeds[0].footer.text.split('/')[0])-1
    
        interaction.message.guild.members.fetch().then(users => {
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
                if (Object.keys(sorted[i])[0] === interaction.user.id) { rank = i + 1 }
            }
            if (rank) {
               rank = '#'+rank
            }
            let lbemd = new MessageEmbed()
                .setTitle('Producer and Artist Hub Leaderboard')
                .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
                .setFooter(`${++current}/${paginated.length}`)
            let desc = `Your leaderboard rank: **${rank ? rank : 'N/A'}**\n\n`


            if (!paginated[arrnum]) return interaction.message.reply({ content: ['An error occurred.'] })

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
        
        if (interaction.user.id != interaction.customId.split('_')[1]) {

            return interaction.message.reply({
                embeds: [new MessageEmbed().setTitle("Invalid").setDescription("It's not your message.")],
                ephemeral: [true]
            }).catch(e => { console.log(e) })

        }
        
        if (interaction.customId.split('_')[0] === "NextPage") {
            
           
            interaction.deferUpdate().catch(e => { console.log(e) })

            current++
            interaction.message.components[0].components[0].setDisabled(current === 0)
            interaction.message.components[0].components[1].setDisabled(current === paginated.length - 1)
         
            return interaction.message.edit({ embeds: [generateLbEmbed(current)], components: [interaction.message.components[0]] }).catch(e => { console.log(e) })
        }
        if (interaction.customId.split('_')[0] === "PreviousPage") {
          
            interaction.deferUpdate().catch(e => { console.log(e) })
            current--
            interaction.message.components[0].components[0].setDisabled(current === 0)
            interaction.message.components[0].components[1].setDisabled(current === paginated.length - 1)
            return interaction.message.edit({ embeds: [generateLbEmbed(current)], components: [interaction.message.components[0]] }).catch(e => { console.log(e) })
        }

    })
    }

}