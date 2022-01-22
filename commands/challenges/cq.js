const fs = require('fs')

const {MessageEmbed} = require('discord.js')

const logger = require('../../utils/logger')

module.exports = {

    name: "cq",
    desc: "Clear the challenge queue. Only usable by the bot owner.",
    aliases: ['clearqueue','cq'],
    categories: ["challenges"],
    execute: function(client,message,args,db,prefix){

        
        if (message.author.id != "683792601219989601") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })

        db.queue = []

        fs.writeFileSync('./data/queue.json', JSON.stringify(db.queue))

        logger.log({

            action: "queueClear",
            channel: message.channel.id,
            desc: `<@${message.author.id}> cleared the challenge queue.`,
            executor: message.author.id,
            url: message.url
        },client,db)

        return message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Queue was cleared.')] })

    }

}