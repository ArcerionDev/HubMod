const zipdir = require('zip-dir')
const {MessageEmbed} = require('discord.js')
const fs = require('fs')
module.exports = {

    name: "bd",
    desc: "Back up the bot's data in a zip file. Only usable by the bot owner.",
    aliases: ['backupdata','bd'],
    categories: [3],
    execute:  function(client,message,args,db,prefix){

        zipdir('./data', { saveTo: './data.zip' }, async () => {
           await message.reply({embeds: [new MessageEmbed().setTitle('Backup').setDescription(`Saved <t:${Math.floor(Date.now() / 1000)}:R>`)],files: ['./data.zip/']})
            fs.unlinkSync('./data.zip/')
        })
      
    }
}