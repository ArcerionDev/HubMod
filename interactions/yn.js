const fs = require('fs')
const {MessageEmbed} = require('discord.js');
function makeid(r) { for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < r; n++)a += t.charAt(Math.floor(Math.random() * t.length)); return a }
const logger = require('../utils/logger')
module.exports = {

    customids: ['y','n'],

    execute: function(client,interaction,db,prefix){

        let temp = JSON.parse(fs.readFileSync('./data/temp.json'))

        let chal = temp[interaction.customId.split('_')[2]]

        if (interaction.user.id != interaction.customId.split('_')[1]) {
             return interaction.reply({
                embeds: [new MessageEmbed().setTitle("Invalid").setDescription("It's not your message.")],
               ephemeral: [true]
            }).catch(error => { console.log(error) })
        }

        if(!chal) {
            interaction.reply({
            embeds: [new MessageEmbed().setTitle("Error").setDescription("Invalid challenge.")],
            ephemeral: [true]
         }).catch(error => { console.log(error) })
        return interaction.deferUpdate();
        }

    let id = interaction.customId.slice(0).split('_')[0]
        if (id === "y") {
            chal.push(makeid(10))
            db.queue.push(chal)
            fs.writeFileSync('./data/queue.json', JSON.stringify(db.queue))
            interaction.message.components[0].components[0].setDisabled(true)
            interaction.message.components[0].components[1].setDisabled(true)
            interaction.deferUpdate()
            interaction.message.edit({ embeds: [new MessageEmbed().setTitle(interaction.message.embeds[0].title).setDescription('Your submission will next be sent to a queue. Does this look ok?').addField(`${chal[0]} • Team members - ${chal[2]}`, `${chal[1]} • Submitted by <@${chal[3]}>`, false)], components: [interaction.message.components[0]] }).catch(error => { console.log(error) })
            delete temp[interaction.customId.split('_')[2]]
            fs.writeFileSync('./data/temp.json', JSON.stringify(temp))
            interaction.message.reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`Your challenge has been submitted for approval! I'll dm you when it's been approved / denied.`)] }).catch(error => { console.log(error) })
            logger.log({

                action: "submitChallenge",
                channel: interaction.message.channel.id,
                desc: `<@${interaction.user.id}> submitted challenge ${chal[0]} (${chal[4]}) to the challenge queue.`,
                executor: interaction.user.id,
                url: interaction.message.url
            },client,db)
            return client.channels.fetch(db.channels.queue).then(c => {
    
                c.send({ embeds: [new MessageEmbed().setTitle('New queued challenge with ID `' + chal[4] + "`.").addField(`${chal[0]} • Team members - ${chal[2]}`, `${chal[1]} • Submitted by <@${chal[3]}>`, false).setDescription(`Run the command ` + '`' + `${prefix}approve ${chal[4]}` + '` to approve this submission.')] }).catch(error => { console.log(error) })
    
            })
        }
        if (id === "n") {
            interaction.message.components[0].components[0].setDisabled(true)
            interaction.message.components[0].components[1].setDisabled(true)
            interaction.message.edit({ embeds: [new MessageEmbed().setTitle(interaction.message.embeds[0].title).setDescription('Your submission will next be sent to a queue. Does this look ok?').addField(`${chal[0]} • Team members - ${chal[2]}`, `${chal[1]} • Submitted by <@${chal[3]}>`, false)], components: [interaction.message.components[0]] }).catch(error => { console.log(error) })            //interaction.deferUpdate();
            delete temp[interaction.customId.split('_')[2]]
            
            fs.writeFileSync('./data/temp.json', JSON.stringify(temp))
            return interaction.message.reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to resubmit a new challenge.`)] }).catch(error => { console.log(error) })
    
        }
    

    }


}