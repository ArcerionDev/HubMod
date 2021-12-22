const {MessageEmbed} = require('discord.js');
module.exports = {

    name: "shop",
    desc: "Get a list of things you can buy with your bling.",
    aliases: ['shop'],
    input: ['category (optional)'],
    categories: [1],
    execute: function(client,message,args,db,prefix){

        let shop = new MessageEmbed()
            .setTitle('The Bling Shop')
            .setDescription('Buy perks and items with the command `'+prefix+'buy [item]`')
            .addField('<:bling:693310674612387862> 10,000 - Spotlight', `Get a chance to advertise your creations in <#${db.channels.spotlight}> for all to see!`)
            .addField('<:bling:693310674612387862> 50,000 - Hustler', `Gain the **Hustler** role. Gives you a special color above everyone else, exclusive chat access, and the ability to react to more messages.`)
            .addField('<:bling:693310674612387862> Varied - Sample Packs', `Purchase community made sample packs! Use ${prefix}shop samplepacks for more details.`)
        if (!args[1]) {
            message.channel.send({ embeds: [shop] })
        } else {

            switch (args[1]) {

                case 'samplepacks':



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

                    break;
                default:
                    message.channel.send({ embeds: [shop] })
                    break;
            }

        }

    }

}