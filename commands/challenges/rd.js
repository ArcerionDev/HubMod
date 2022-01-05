module.exports = {

    // put in other things
    name: "rd",
    desc: "Get a random daily 30 from the last ~100.",
    aliases: ['rd', 'randomdaily'],
    categories: [0],
    execute: function (client, message, args, db, prefix) {

        message.guild.channels.fetch('484557165340655657').then(c => {

            c.messages.fetch().then(m => {

                let d = Array.from(Array.from(m)[Math.floor(Math.random() * Array.from(m).length)])[1]


                const { MessageEmbed } = require('discord.js')
                let emb = new MessageEmbed()
                    .setTitle(`Daily 30 by ${d.author.tag}`)
                    .setThumbnail(d.author.avatarURL())
                if (d.content) {

                    emb.setDescription(d.content)

                }


                message.channel.send({

                    embeds: [

                        emb

                    ],

                    files: [Array.from(d.attachments)[0][1].attachment]

                })

            })

        })

    }


}