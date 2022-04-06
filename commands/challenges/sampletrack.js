const fs = require('fs')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
module.exports = {
    name: "sampletrack",
    desc: "Find a sample to pick for a sample track challenge. Only usable by moderators.",
    aliases: ['sampletrack','st'],
    categories: ["challenges"],
    execute: function(client,message,args,db,prefix){
        message.guild.members.fetch(message.author.id).then(fetchUser => {
            if (!fetchUser.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, you don't have permission to run this command.`)] })
     
            let sampleidx = JSON.parse(fs.readFileSync('./samples/sampleidx.json','utf-8'))
        
            let sample = sampleidx[~~(Math.random() * sampleidx.length)]
      
        let picknew = new MessageButton()
        .setCustomId(`picknew_${message.author.id}`)
        .setLabel('🔀')
        .setStyle('PRIMARY')
        
        let accept = new MessageButton()
        .setCustomId(`acceptsample_${message.author.id}`)
        .setLabel('✅')
        .setStyle('PRIMARY')

        let buttons = new MessageActionRow()
                    .addComponents(
                       picknew, accept
                    );

                    logger.log({

                        action: "startSTChallenge",
                        channel: message.channel.id,
                        desc: `<@${message.author.id}> started a sample track challenge.`,
                        executor: message.author.id,
                        url: message.url
                    },client,db)
            
    
    message.channel.send({embeds: [new MessageEmbed().setTitle('New Sample Track Challenge').setDescription(`**Rewards**\n\nWinner(s): **${sample.w}** <:bling:693310674612387862>\n\nCreativity: **${sample.c}** <:bling:693310674612387862>\n\nEntry: **${sample.e}** <:bling:693310674612387862>\n\nThe sample for the challenge is attached above.`).setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512').setFooter(`Command executed by ${message.author.tag} | Developed by Arcerion#7298 🖤`)], components: [buttons], files: [sample.path]})
    })}
}