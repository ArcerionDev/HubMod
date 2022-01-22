const {MessageEmbed} = require('discord.js');

module.exports = {

    name: "samplepackdetails",
    desc: "Get details on a samplepack.",
    aliases: ['samplepackdetails','sd'],
    input: ['ID'],
    categories: ["samplepacks"],
    execute: async function(client,message,args,db,prefix){

        args = message.content.split(' ')
        if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please include a samplepack ID to get details on.')] });
        if (!db.samplepacks[args[1]]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please include a samplepack ID to get details on.')] });
        let data = db.samplepacks[args[1]]
        let toSend = { embeds: [new MessageEmbed().setTitle(`Details of sample pack ${data.title}`).setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512').setDescription(`:fire: **${data.title}**\n\n\n\n:notepad_spiral: ${data.desc}\n\n:microphone: ${(await (await client.users.fetch(data.author)).tag)}\n\n${data.demo ? ":cd: Demo included above" : ":x: No demo included"}\n\n<:bling:693310674612387862> ${data.value}\n\n:tools: ${"`" + data.id + "`"}`).setFooter(`Use the command ${prefix}buy ${data.id} to buy this pack.`)] }
        if (data.demo) { toSend.files = [data.demo] }
        message.channel.send(toSend)

    }

}