const {MessageEmbed} = require('discord.js');

module.exports = {

    name: "samplepacks",
    desc: "Get the community's current samplepacks in a list.",
    aliases: ['samplepacks','sp'],
    categories: ["samplepacks"],
    execute: function(client,message,args,db,prefix){

        let displays = []

                    Object.keys(db.samplepacks).forEach(e => {

                        displays.push(`${message.guild.members.cache.get(db.samplepacks[e].author).user.tag} - ${db.samplepacks[e].title} ${'`(' + e + ')`'}`)
                    })
                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setTitle('Community Samplepacks')
                            .setDescription(`**Use ${prefix}sd / ${prefix}samplepackdetails [ID] for more info on a samplepack.**\n\n\n${displays.join('\n\n')}`)
                            .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
                        ]
                    })

    }
}