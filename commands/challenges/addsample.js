const fs = require('fs');
const {MessageEmbed} = require('discord.js');
const logger = require("../../utils/logger");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    name: "addsample",
    desc: "Add a sample to the sample track database. Only usable by moderators, requires an audio file to be attached.",
    aliases: ['addsample','as'],
    input: ["winnerreward","creativityreward", "entryreward"],
    categories: ["challenges"],
    execute: function(client,message,args,db,prefix){
        if((!args[1]) || (!args[2]) || (!args[3])) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You must provide a winner reward, creativity reward, and entry reward.`)] })
        if(isNaN(args[1]) || isNaN(args[2]) || (isNaN(args[1]))) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`All rewards must be a number.`)] })
        if(![...message.attachments].length) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You must attach an audio file.`)] })
        if([...message.attachments][0][1].contentType.split('/')[0] != "audio") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`The file type must be audio.`)] })
        let w = args[1]
        let c = args[2]
        let e = args[3]       
        let d = [...message.attachments][0][1];
        (async () => {
            const response = await fetch(d.attachment);
            const buffer = await response.buffer();
            fs.writeFileSync(`./samples/${d.name.split('.')[0]}_${d.id}.${d.name.split('.')[1]}`, buffer, () => 
        {
        });
        let sampleidx = JSON.parse(fs.readFileSync('./samples/sampleidx.json','utf-8'))
        sampleidx.push({
            w: parseInt(w),
            c: parseInt(c),
            e: parseInt(e),
            path: `./samples/${d.name.split('.')[0]}_${d.id}.${d.name.split('.')[1]}`
        })
        fs.writeFileSync('./samples/sampleidx.json', JSON.stringify(sampleidx))
        
        logger.log({

            action: "adddSample",
            channel: message.channel.id,
            desc: `<@${message.author.id}> added a sample to the sample track database.`,
            executor: message.author.id,
            url: message.url
        },client,db)

        return message.reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`The sample was added to the database.`)] })
            })()

    }
}