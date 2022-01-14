const fs = require('fs')
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
function makeid(r) { for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < r; n++)a += t.charAt(Math.floor(Math.random() * t.length)); return a }
module.exports = {

    name: "sc",
    desc: "Submit a challenge to the server database.",
    aliases: ['submitchallenge','sc'],
    categories: [0],
    execute: function(client,message,args,db,prefix){

          /* 0 is title
         1 is desc
         2 is num of people
         3 is submitter
        */
         let chal = []
         message.reply({ embeds: [new MessageEmbed().setTitle('Alright! First things first! What do you want the challenge name to be?').setDescription('Please answer by sending another message below, keep the title length to 150 characters or under.')] }).then(() => {
             const filter = m => m.author.id === message.author.id;
             message.channel.awaitMessages({ filter, max: 1 })
                 .then(title => {
                     if (title.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new challenge.`)] })
                     if (title.first().content.length > 150) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please restart the command and make the title length 150 characters or under.')] })
                     chal.push(title.first().content)
                     title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, your title is `' + title.first().content + '`!\n\n Next, provide a short description of the challenge.').setDescription('Please make this under 150 characters.')] }).then(() => {
                         message.channel.awaitMessages({ filter, max: 1 })
                             .then(desc => {
                                 if (desc.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new challenge.`)] })
                                 if (desc.first().content.length > 150) return desc.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please restart the command and make the description length 150 characters or under.')] })
                                 chal.push(desc.first().content)
                                 desc.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, your description is set!\n\n Next, provide how many people can partake in this challenge.').setDescription('Please answer by sending another message below.')] }).then(() => {
                                     message.channel.awaitMessages({ filter, max: 1 })
                                         .then(amount => {
                                             if (amount.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new challenge.`)] })
                                             chal.push(amount.first().content)
                                             chal.push(message.author.id)
                                            let tempid = makeid(10)
                                             let y = new MessageButton()
                                                 .setCustomId(`y_${message.author.id}_${tempid}`)
                                                 .setLabel('Yes')
                                                 .setStyle('SUCCESS')
                                             let n = new MessageButton()
                                                 .setCustomId(`n_${message.author.id}_${tempid}`)
                                                 .setLabel('No')
                                                 .setStyle('SECONDARY')
 
                                             let yn = new MessageActionRow()
                                                 .addComponents(
                                                     y,
                                                     n
                                                 );
                                             amount.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, set to `' + amount.first().content + '`!\n\n').setDescription('Your submission will next be sent to a queue. Does this look ok?').addField(`${chal[0]} • Team members - ${chal[2]}`, `${chal[1]} • Submitted by <@${chal[3]}>`, false)], components: [yn] }).then(() => {

                                                let temp = JSON.parse(fs.readFileSync('./data/temp.json'))

                                                temp[tempid] = chal

                                                fs.writeFileSync('./data/temp.json', JSON.stringify(temp))

                                             })
                                                 
 
                                            
 
                                         })
 
 
                                 })
                             })
                     })
                 })
 
         })
 

    }

}