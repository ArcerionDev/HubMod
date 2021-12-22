const fs = require('fs')
let {MessageEmbed} = require('discord.js')
module.exports = function(reaction, db, prefix){

    if (reaction.message.author.bot) return;
    reaction.message.fetch(reaction.message.channelId).then(m => {

        reaction.fetch().then(e => {
            if (e.message.channel.id != db.channels.daily) return; // checking if it's in #daily-30
            if (Array.from(m.reactions.cache).length > 1) return; // checking if there's more than one unique reaction
            if (Array.from(m.reactions.cache)[0][1].count > 1) return; // checking if there's more than one person reacting with the same emoji
            // assuming all criteria has been met, we give the user a dm and some currency
            e.message.author.send({ embeds: [new MessageEmbed().setTitle('Bling Given').setDescription(`<@${reaction.message.author.id}>, you've recieved 2,000 bling.\n\n` + "Use `"+prefix+"balance` in <#" + db.channels.cmds + "> to check your current amount.").setThumbnail(e.message.author.displayAvatarURL()).setTimestamp()] }).catch(e => { console.log(e) })

            // get currency data

            db.blingdata = JSON.parse(fs.readFileSync('./data/currencystore.json', 'utf-8'))

            if (db.blingdata[e.message.author.id]) { // check if user is already in the database...

                db.blingdata[e.message.author.id] = db.blingdata[e.message.author.id] + 2000 // and gives them 2k additional
            } else { // otherwise...
                db.blingdata[e.message.author.id] = 2000 // makes a new object just for them

            }
            fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata)) // now that currency has been given, we update the data.

        })
    })

}