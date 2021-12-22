let { MessageEmbed } = require('discord.js');
module.exports = {

    name: "help",
    desc: "Get a list of commands you can use with the bot.",
    aliases: ['help'],
    input: ['module'],
    categories: [3],
    execute: function (client, message, args, db, prefix) {
        let categories = require('../categories')
        let commands = Array.from(require('../../index').commands)
        let helpemb = new MessageEmbed()
            .setTitle('HubMod modules')
            .setDescription('Type `' + prefix + 'help [module]` for info on the commands in each module.')
            .setThumbnail(`https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`)
            .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
            .setFooter('Bot developed by Arcerion#7298 🖤')
            .setTimestamp()

        Array.from(categories).forEach(c => {
            helpemb.addField(
                c.name.charAt(0).toUpperCase() + c.name.slice(1),
                c.desc,
                false
            )
        })


        if (!args[1]) {

            message.channel.send({ embeds: [helpemb] })
        } else {
            let module = null
            Array.from(categories).forEach(c => {

                if (c.name.startsWith(args[1])) {
                    module = [categories.indexOf(c), c]
                }

            })
            if (!module) { return message.channel.send({ embeds: [helpemb] }) }
            let specemb = new MessageEmbed()
                .setTitle(`${(module[1].name.charAt(0).toUpperCase() + module[1].name.slice(1)).charAt(module[1].name.length - 1) === 's' ? (module[1].name.charAt(0).toUpperCase() + module[1].name.slice(1)).substring(0, module[1].name.length - 1) : (module[1].name.charAt(0).toUpperCase() + module[1].name.slice(1))} commands`)
                .setDescription(module[1].desc)
                .setThumbnail(`https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`)
                .setAuthor(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
                .setFooter('Bot developed by Arcerion#7298 🖤')
                .setTimestamp()
            commands.forEach(c => {

                if (c[1].categories.includes(module[0])) {
                    let inputs = []
                    delete inputs[c[1].aliases.indexOf(c[1].name)]

                    if (c[1].input) {
                        c[1].input.forEach(i => {
                            inputs.push(`[${i}]`)
                        })
                    }
                    let akas = []
                    c[1].aliases.forEach(a => {
                        akas.push(`${prefix}${a}`)
                    })

                    specemb.addField(
                        `${prefix}${c[1].name} ${inputs.filter(Boolean).length ? '`' + inputs.filter(Boolean).join(' ') + '`' : ''}`,
                        `${akas.filter(Boolean).length ? `**AKA ${akas.filter(Boolean).join(', ')}** • ` : ''} ${c[1].desc}`,
                        false
                    )

                }

            })

            message.channel.send({ embeds: [specemb] })

        }

    }
}