const fs = require('fs')
const {MessageEmbed} = require('discord.js');
const logger = require('../../utils/logger')
module.exports = {

    name: "approve",
    desc: "Approve a challenge/samplepack in the queue. Only usable by moderators.",
    aliases: ["approve"],
    input: ["ID"],
    categories: [0,2],
    execute: function(client,message,args,db,prefix){

        message.guild.members.fetch(message.author.id).then(fetchUser => {
            if (!fetchUser.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, you don't have permission to run this command.`)] })
            if (message.channel.id != db.channels.queue) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, this command can only be used in <#${db.channels.queue}>`)] })
            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('You need to include a submission to approve.')] })
            args = message.content.split(' ')
            if (db.spqueue[args[1]]) {

                let data = db.spqueue[args[1]]

                db.samplepacks[data.id] = data

                delete db.spqueue[args[1]]

                fs.writeFileSync('./data/spqueue.json', JSON.stringify(db.spqueue))

                fs.writeFileSync('./data/samplepacks.json', JSON.stringify(db.samplepacks))

                message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Submission approved.')] })

                logger.log({

                    action: "approveSamplepack",
                    user: data.author,
                    channel: message.channel.id,
                    desc: `<@${message.author.id}> approved <@${data.author}>'s samplepack ${data.id} (${data.title}).`,
                    executor: message.author.id,
                    url: message.url
                },client,db)

                return client.channels.fetch(db.channels.samplepacks).then(async c => {
                    let toSend = { embeds: [new MessageEmbed().setTitle('New samplepack in shop!').setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512').setDescription(`:fire: **${data.title}**\n\n\n\n:notepad_spiral: ${data.desc}\n\n:microphone: ${(await (await client.users.fetch(data.author)).tag)}\n\n${data.demo ? ":cd: Demo included above" : ":x: No demo included"}\n\n<:bling:693310674612387862> ${data.value}\n\n:tools: ${"`" + data.id + "`"}`).setFooter(`Use the command ${prefix}buy ${data.id} to buy this pack.`)] }
                    if (data.demo) { toSend.files = [data.demo] }
                    c.send(toSend)

                })
            } else {
                let submission = null;
                for (let i = 0; i < db.queue.length; i++) {
                    if (db.queue[i][4] === args[1]) {
                        submission = i
                    }
                }
                if (submission === null) { return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription('That submission is invalid, or no longer exists.')] }) }
                let chalname = db.queue[submission][0]
               let author = db.queue[submission][3]
              client.users.fetch(author).then(u => {

                u.send({ embeds: [new MessageEmbed().setTitle('Approved! :tada:').setDescription('Your challenge `' + chalname + '` has been approved!').setTimestamp().setThumbnail(u.displayAvatarURL())] }).catch(e => { console.log(e) })
            
            })     
               
                let data = db.queue[submission].slice(0)
                db.queue[submission].pop() // removing queue id
                db.ccs.push(db.queue[submission])
                delete db.queue[submission];
                db.queue = db.queue.filter(Boolean)
                fs.writeFileSync('./data/queue.json', JSON.stringify(db.queue))
                fs.writeFileSync('./data/communitychallenges.json', JSON.stringify(db.ccs))
                logger.log({

                    action: "approveChallenge",
                    user: author,
                    channel: message.channel.id,
                    desc: `<@${message.author.id}> approved <@${author}>'s challenge ${data[0]} (${data[4]}).`,
                    executor: message.author.id,
                    url: message.url
                },client,db)
                return message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Submission approved.')] })
            }
        })

    }

}