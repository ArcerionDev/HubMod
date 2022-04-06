const {MessageEmbed} = require('discord.js');
module.exports = {
    name: "balance",
    desc: "Get a user's balance.",
    aliases: ["bal","balance"],
    input: ['@user (optional)'],
    categories: ["currency"],
    execute: function(client,message,args,db,prefix){
        message.guild.members.fetch(message.author.id).then(async e => {

            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle(`Your balance`).setDescription(`You currently have ${'`'}${JSON.stringify(db.blingdata[message.author.id]).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${'`'} bling.`).setFooter(`Use ${prefix}lb to see where you fall on the leaderboard.`).setThumbnail(message.author.avatarURL()).setTimestamp()] })

           
            let subject = null;

            if(args[1].match(/(\d+)/)){

                subject = args[1].match(/(\d+)/)[0]

            }else{
                let user = Array.from(await (await message.guild.members.fetch())).find(u => u[1].displayName.toLowerCase().includes(args[1]))
                
                if(user){subject = user[1].id}
            }

            if (!subject) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`<@${message.author.id}>, provide a valid user.`)] })

            if(subject === message.author.id) return message.reply({ embeds: [new MessageEmbed().setTitle(`Your balance`).setDescription(`You currently have ${'`'}${JSON.stringify(db.blingdata[subject]).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${'`'} bling.`).setFooter(`Use ${prefix}lb to see where you fall on the leaderboard.`).setThumbnail(message.author.avatarURL()).setTimestamp()] })

            let user = await (await client.users.fetch(subject))

            
           return message.reply({ embeds: [new MessageEmbed().setTitle(`${user.username}#${user.discriminator}${db.blingdata[subject] ? `'s balance` : ' has no money.'}`).setDescription(`${db.blingdata[subject] ? `<@${subject}> currently has ${'`'}${JSON.stringify(db.blingdata[subject]).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${'`'} bling.` : `Chat or participate in challenges to get money!`}`).setThumbnail(user.avatarURL()).setFooter(`${db.blingdata[subject] ? `Use ${prefix}lb to see where they fall on the leaderboard.` : 'Check out the challenges category in the server to get started.'}`).setTimestamp()]})
            
        })
    }
}