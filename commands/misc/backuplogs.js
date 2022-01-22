const zipdir = require('zip-dir')
const {MessageEmbed} = require('discord.js')
const fs = require('fs')
const logger = require('../../utils/logger')
module.exports = {

    name: "backuplogs",
    desc: "Back up logs that the bot has recorded. Only usable by the bot owner.",
    aliases: ['backuplogs','bl'],
    categories: ["misc"],
    execute:  function(client,message,args,db,prefix){
        if (message.author.id != "683792601219989601") return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })

        zipdir('./logs/', { saveTo: './logs.zip' }, async () => {
           await message.reply({embeds: [new MessageEmbed().setTitle('Backup').setDescription(`Saved <t:${Math.floor(Date.now() / 1000)}:R>`)],files: ['./logs.zip/']})
         fs.unlinkSync('./logs.zip')
         logger.log(
            {
              action: "logsBackup",
              channel: message.channel.id,
              desc: `<@${message.author.id}> backed up the bot's logs.`,
              executor: message.author.id,
              url: message.url,
            },
            client,
            db
          );
        })
      
    }
}