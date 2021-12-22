const fs = require('fs')
const {MessageEmbed} = require('discord.js');

module.exports = {
    name: "add",
    desc: "Add an amount to a user's balance. Only usable by moderators.",
    aliases: ["add","give"],
    input: ['@user','amount'],
    categories: [1],
    execute: function(client,message,args,db,prefix){
        message.guild.members.fetch(message.author.id).then(e => {


            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a user.`)] })
            if (!args[1].startsWith('<@')) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a user.`)] })
            if (!args[2]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide an amount to add to this user's balance.`)] })
            if (!message.mentions.members.first()) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a valid user.`)] })

            args[2] = args[2].replaceAll('k', '000')

            let hasNonNum = false

            let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
            args[2].split('').forEach(e => {

                if (!numbers.includes(e)) {
                    hasNonNum = true
                }

            })
            if (hasNonNum) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a real number.`)] })

            if (parseInt(args[2]) == 0) { return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide number greater than 0.`)] }) }

            if (!e.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, you don't have permission to run this command.`)] })

            if (db.blingdata[message.mentions.members.first().id]) {

                db.blingdata[message.mentions.members.first().id] = db.blingdata[message.mentions.members.first().id] + parseInt(args[2])
            } else {
                db.blingdata[message.mentions.members.first().id] = parseInt(args[2])
            }
            fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))

            message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`Successfully gave ${args[2]} bling to ${message.mentions.members.first().user.tag}.`)] })

        })
    }
}