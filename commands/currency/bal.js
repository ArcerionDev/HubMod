const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "bal",
    desc: "Get a user's balance.",
    aliases: ['bal','balance'],
    input: ['@user (optional)'],
    categories: [1],
    execute: function(client,message,args,db,prefix){

        if (message.mentions.members.first()) {
            if (db.blingdata[message.mentions.members.first().id]) {

                let bal = db.blingdata[message.mentions.members.first().id]

                message.channel.send({ embeds: [new MessageEmbed().setTitle(`${message.mentions.members.first().user.tag}`).setDescription(message.mentions.members.first().user.tag + ' currently has `' + bal + '` bling.').setThumbnail(message.mentions.members.first().user.displayAvatarURL()).setTimestamp()] })

            } else {

                message.channel.send({ embeds: [new MessageEmbed().setTitle(`${message.mentions.members.first().user.tag} has no money.`).setThumbnail(message.mentions.members.first().user.displayAvatarURL()).setTimestamp()] })


            }
        }

        else {

            if (db.blingdata[message.author.id]) {

                let bal = db.blingdata[message.author.id]

                message.channel.send({ embeds: [new MessageEmbed().setTitle(`${message.author.tag}'s balance`).setDescription('You currently have `' + bal + '` bling.').setThumbnail(message.author.displayAvatarURL()).setTimestamp()] })

            } else {

                message.channel.send({ embeds: [new MessageEmbed().setTitle(`${message.author.tag}, you have no money.`).setDescription(`Chat or post submissions in <#${db.channels.daily}> to get bling to buy things from the shop!`).setThumbnail(message.author.displayAvatarURL()).setTimestamp()] })


            }
        }

    }
}