const fs = require('fs')
const {MessageEmbed} = require('discord.js');
function makeid(r) { for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = 0; n < r; n++)a += t.charAt(Math.floor(Math.random() * t.length)); return a }
module.exports = {

    name: "ss",
    desc: "Submit a samplepack to the queue.",
    aliases: ['submitsamplepack','ss'],
    categories: [2],
    execute: function(client,message,args,db,prefix){

        
        let sd = {}
        message.reply({ embeds: [new MessageEmbed().setTitle('What do you want the sample pack title to be?').setDescription('Please answer by sending another message below, keep the title length to 150 characters or under.')] }).then(() => {
            const filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages({ filter, max: 1 })
                .then(title => {
                    if (title.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new sample pack.`)] })
                    if (title.first().content.length > 150) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please restart the command and make the title length 150 characters or under.')] })
                    sd.title = title.first().content
                    title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, your title is `' + title.first().content + '`!\n\n Next, provide a short description of the samplepack.').setDescription('Please make this under 150 characters.')] }).then(() => {
                        message.channel.awaitMessages({ filter, max: 1 })
                            .then(desc => {
                                if (desc.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new sample pack.`)] })
                                if (desc.first().content.length > 150) return desc.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Please restart the command and make the description length 150 characters or under.')] })
                                sd.desc = desc.first().content
                                desc.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, your description is set!\n\n Next, provide a demo of the sample pack as an audio file (optional).\n\nThis can be one fill, or an entire track made with your sample pack contents.').setDescription('Please answer by sending another message below.')] }).then(() => {
                                    message.channel.awaitMessages({ filter, max: 1 })
                                        .then(demo => {
                                            if (demo.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new sample pack.`)] })
                                            if (!demo.first().attachments.map(e => e).length) {
                                                sd.demo = null
                                            } else {
                                                sd.demo = demo.first().attachments.map(e => e)[0].url
                                            }
                                            sd.author = message.author.id

                                            demo.first().reply({ embeds: [new MessageEmbed().setTitle(demo.first().attachments.map(e => e).length ? "Success! Your demo was added." : "Alright, you didn't include a demo.").setDescription('Now, upload your sample pack to [megafile.cc](https://megafile.cc/) (make sure the folder is zipped) and send the file link. It will be deleted after you send it for confidentiality.').setImage("https://i.imgur.com/X1A8fqI.png")] }).then(() => {
                                                function getFile() {

                                                    message.channel.awaitMessages({ filter, max: 1 })
                                                        .then(file => {

                                                            if (file.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new sample pack.`)] })

                                                            if (!file.first().content.startsWith('https://megafile.cc/')) {
                                                                file.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Your link was detected as invalid. Please enter another one.')] }).then(() => {
                                                                    file.first().delete()
                                                                    getFile()
                                                                })
                                                            } else {

                                                                sd.url = file.first().content
                                                                file.first().reply({ embeds: [new MessageEmbed().setTitle('Alright, your sample pack URL is set!\n\n Next, provide a valid cost for the sample pack. Make this a number, no special characters. e.g. `20000`').setDescription('Please answer by sending another message below.\n\n*Doing this will add your samplepack to the database.*')] }).then(() => {
                                                                    file.first().delete()
                                                                    function getVal() {
                                                                        message.channel.awaitMessages({ filter, max: 1 })
                                                                            .then(amt => {
                                                                                if (amt.first().content.includes(`${prefix}cancel`)) return title.first().reply({ embeds: [new MessageEmbed().setTitle('Alright.').setDescription(`Restart the command if you'd like to submit a new sample pack.`)] })
                                                                                let value = amt.first().content
                                                                                if (isNaN(value)) {

                                                                                    amt.first().reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('Your amount was detected as invalid. Please enter another one.')] }).then(() => {
                                                                                        getVal()

                                                                                    })


                                                                                } else {

                                                                                    sd.value = parseInt(value)
                                                                                    amt.first().reply({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`Your sample pack has been submitted with a price of ${value}.`)] }).catch(error => { console.log(error) })
                                                                                    sd.id = makeid(10)
                                                                                    db.spqueue[sd.id] = sd
                                                                                    sd.buyers = []
                                                                                    fs.writeFileSync('./data/spqueue.json', JSON.stringify(db.spqueue))
                                                                                    let toSend = { embeds: [new MessageEmbed().setTitle('New queued samplepack with ID `' + sd.id + "`.").addField(`Title - ${sd.title} • Description - ${sd.desc}`, `Cost - ${sd.value} • URL - ${sd.url}`, false).setDescription(`Run the command ` + '`' + `${prefix}approve ${sd.id}` + '` to approve this submission.')] }
                                                                                    if (sd.demo) { toSend.files = [sd.demo] }
                                                                                    client.channels.fetch(db.channels.queue).then(c => {

                                                                                        c.send(toSend).catch(error => { console.log(error) })

                                                                                    })

                                                                                }
                                                                            })
                                                                    }
                                                                    getVal()
                                                                })


                                                            }
                                                        })


                                                }
                                                getFile()
                                            })

                                        })


                                })
                            })
                    })
                })

        })


    }

}