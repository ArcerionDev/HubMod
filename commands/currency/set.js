const fs = require('fs')
const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "set",
    desc: "Set a user's balance. Only usable by moderators.",
    aliases: ['set'],
    input: ['@user','amount'],
    categories: [1],
    execute: function(client,message,args,db,prefix){
        message.guild.members.fetch(message.author.id).then(e => {

            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a user.`)] })
            if (!args[2]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide an amount to set this user's balance to.`)] })
            if (!message.mentions.members.first()) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a valid user.`)] })

            let hasNonNum = false

            let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
            args[2].split('').forEach(e => {

                if (!numbers.includes(e)) {
                    hasNonNum = true
                }

            })
            if (hasNonNum) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a real number.`)] })

            if (!e.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, you don't have permission to run this command.`)] })

            db.blingdata[message.mentions.members.first().id] = parseInt(args[2])


            Object.keys(db.blingdata).forEach(e => {
                if (db.blingdata[e] < 1) { delete db.blingdata[e] }
            });

            fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))

            message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`Successfully set ${message.mentions.members.first().user.tag}'s balance to ${args[2]}.`)] })

        })
    }
}