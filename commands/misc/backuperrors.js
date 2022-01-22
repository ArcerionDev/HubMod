const zipdir = require('zip-dir')
const {MessageEmbed} = require('discord.js')
const fs = require('fs')
const logger = require('../../utils/logger')
module.exports = {

    name: "backuperrors",
    desc: "Back up errors that the bot has logged. Only usable by the bot owner.",
    aliases: ['backuperrors','be'],
    categories: ["misc"],
    execute:  function(client,message,args,db,prefix){
        if (message.author.id != "683792601219989601") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })

        zipdir('./errorlogs/', { saveTo: './errors.zip' }, async () => {
           await message.reply({embeds: [new MessageEmbed().setTitle('Backup').setDescription(`Saved <t:${Math.floor(Date.now() / 1000)}:R>`)],files: ['./errors.zip/']})
         fs.unlinkSync('./errors.zip')
         logger.log(
            {
              action: "errorBackup",
              channel: message.channel.id,
              desc: `<@${message.author.id}> backed up the bot's errors`,
              executor: message.author.id,
              url: message.url,
            },
            client,
            db
          );
        })
      
    }
}