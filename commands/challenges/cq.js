module.exports = {

    name: "cq",
    desc: "Clear the challenge queue. Only usable by the bot owner.",
    aliases: ['clearqueue','cq'],
    categories: [0],
    execute: function(client,message,args,db,prefix){

        
        if (message.author.id != "683792601219989601") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })

        db.queue = []

        fs.writeFileSync('./data/queue.json', JSON.stringify(db.queue))

        message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Queue was cleared.')] })

    }

}