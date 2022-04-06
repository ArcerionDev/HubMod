const {MessageEmbed} = require('discord.js');

module.exports = {

    name: "rt",
    desc: "Sort a list of userIDs into random teams of 2.",
    aliases: ['randomteams','rt'],
    input: ['IDs'],
    categories: ["challenges"],
    execute: function(client,message,args,db,prefix){
        if (args.length < 3) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, please include at least 2 IDs.`)] })
        if (args.length > 50) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, please limit your IDs to a maximum of 50.`)] })
        args.shift()
        let hasNonNum = false;
        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        args.forEach(d => {
            d.split('').forEach(e => {
                if (!numbers.includes(e)) {
                    hasNonNum = true
                }

            })
        })
        if (hasNonNum) return;
        args = _.chunk(args.sort(() => .5 - Math.random()), 2)
        let oddoneout = null
        if (args[args.length - 1].length = 1) {
            oddoneout = args[args.length - 1][0]
        }
        args.pop()
        let randemb = new MessageEmbed()
            .setTitle('Success! :tada:')
            .setDescription('Here are your teams.');

        args.forEach(function callback(value, index) {
            randemb.addField(`Team ${index + 1}:`, `<@${value[0]}> and <@${value[1]}>`)
        })
        if (oddoneout) { randemb.addField(`Lonely team of 1:`, `<@${oddoneout}>`) }
        message.reply({ embeds: [randemb] })
    }

}