const zipdir = require('zip-dir')
const {MessageEmbed} = require('discord.js')
const fs = require('fs')
const logger = require('../../utils/logger')
module.exports = {

    name: "backupdata",
    desc: "Back up the bot's data in a zip file. Only usable by the bot owner.",
    aliases: ['backupdata','bd'],
    categories: ["misc"],
    execute:  function(client,message,args,db,prefix){
        if (message.author.id != "683792601219989601") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })

        zipdir('./data', { saveTo: './data.zip' }, async () => {
           await message.reply({embeds: [new MessageEmbed().setTitle('Backup').setDescription(`Saved <t:${Math.floor(Date.now() / 1000)}:R>`)],files: ['./data.zip/']})
           try{fs.unlinkSync('./data.zip/')}catch{}
           logger.log(
            {
              action: "dataBackup",
              channel: message.channel.id,
              desc: `<@${message.author.id}> backed up the bot's data`,
              executor: message.author.id,
              url: message.url,
            },
            client,
            db
          );
        })
      
    }
}