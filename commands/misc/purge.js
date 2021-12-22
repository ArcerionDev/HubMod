module.exports = {

name: "purge",
desc: "Bulk delete a specific number of messages from a channel. Only usable by moderators.",
aliases: ['purge'],
input: ['amount'],
categories: [3],
execute: function(client,message,args,db,prefix){
    message.guild.members.fetch(message.author.id).then(u => {

        if (!u.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription("You don't have permission to execute this command.")] })

        if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide an amount to purge.`)] })

        let hasNonNum = false

        let numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
        args[1].split('').forEach(e => {

            if (!numbers.includes(e)) {
                hasNonNum = true
            }

        })
        if (hasNonNum) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a real number.`)] })

        message.react('✅')
        setTimeout(function () {

            message.delete()
            message.channel.bulkDelete(parseInt(args[1])).catch(() => { })

        }, 700)

    })
}

}