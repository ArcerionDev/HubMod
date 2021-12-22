const fs = require('fs')
const {MessageEmbed} = require('discord.js');
module.exports = {

    name: "buy",
    desc: "Buy an item from the shop.",
    aliases: ['buy'],
    input: ['item'],
    categories: [1],
    execute: function(client,message,args,db,prefix){
        message.guild.members.fetch(message.author.id).then(fetchUser => {
            args = message.content.split(' ')
            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Provide something to buy.')] })



            switch (args[1]) {


                case "hustler":



                    if (!!fetchUser._roles.includes(db.roles.hustler)) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You already have the Hustler role.`)] })

                    if (db.blingdata[message.author.id] < 50000) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You don't have enough money to buy this.`)] })

                    db.blingdata[message.author.id] = db.blingdata[message.author.id] - 50000
                    fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))
                    fetchUser.roles.add(db.roles.hustler)
                    message.reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('The Hustler role was successfully purchased.')] }).catch(error => { console.log(error) })

                    break;

                case 'spotlight':

                    if (!!fetchUser._roles.includes(db.roles.spotlight)) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You have spotlight perms. Post an ad in <#${db.channels.spotlight}> before buying another spotlight.`)] })

                    if (db.blingdata[message.author.id] < 10000) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You don't have enough money to buy this.`)] })

                    db.blingdata[message.author.id] = db.blingdata[message.author.id] - 10000
                    fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))
                    fetchUser.roles.add(db.roles.spotlight)
                    message.reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`A spotlight was successfully purchased. You now have permission to send one message in <#${db.channels.spotlight}>`)] }).catch(error => { console.log(error) })
                    break;
                default:
                    //samplepacks
                    if (!db.samplepacks[args[1]]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please enter a valid item to buy.')] })

                    let data = db.samplepacks[args[1]]
                    if (message.author.id === data.author) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You can't buy your own samplepack. DM <@683792601219989601> if you forgot the download URL.`)] })
                    if (db.samplepacks[args[1]].buyers.includes(message.author.id)) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You've already bought this samplepack. Check DMs with <@${client.user.id}> for the download URL.`)] })
                    if (!db.blingdata[message.author.id]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You don't have enough money to buy this samplepack.`)] })
                    if (JSON.stringify(db.blingdata[message.author.id] - data.value).startsWith('-')) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`You don't have enough money to buy this samplepack.`)] })

                    db.blingdata[message.author.id] = db.blingdata[message.author.id] - data.value
                    db.blingdata[data.author] = db.blingdata[data.author] + data.value
                    db.samplepacks[args[1]].buyers.push(message.author.id)
                    fs.writeFileSync('./data/currencystore.json', JSON.stringify(db.blingdata))
                    fs.writeFileSync('./data/samplepacks.json', JSON.stringify(db.samplepacks))
                    message.reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`Successfully bought ${data.title} for ${data.value} bling. Check your DMs for a download URL.`)] }).catch(error => { console.log(error) })
                    message.author.send({ embeds: [new MessageEmbed().setTitle(`${message.author.tag}, your purchased samplepack has been delivered. :bangbang:`).setDescription(`Direct download URL - ${data.url}`).setThumbnail(`https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`)] }).catch(error => { console.log(error) })
                    client.users.fetch(data.author).then(e => { e.send({ embeds: [new MessageEmbed().setTitle(`${e.tag}, your samplepack ${data.title} was purchased. :bangbang:`).setDescription(`You've recieved ${data.value} bling from ${message.author.tag}'s purchase of your samplepack ${data.title}. This is purchase #${data.buyers.length} of this samplepack.`).setThumbnail(`https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`)] }).catch(error => { console.log(error) }) })
            }
        })
    }

}