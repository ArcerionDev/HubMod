const fs = require('fs')
const {MessageEmbed} = require('discord.js');
module.exports = {

    name: "deny",
    desc: "Deny a challenge/samplepack in the queue. Only usable by moderators.",
    aliases: ["deny"],
    input: ["ID"],
    categories: [0,2],
    execute: function(client,message,args,db,prefix){

        args = message.content.split(' ')
        message.guild.members.fetch(message.author.id).then(fetchUser => {
            if (!fetchUser.permissions.has('32')) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, you don't have permission to run this command.`)] })
            if (message.channel.id != db.channels.queue) return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription(`<@${message.author.id}>, this command can only be used in <#${db.channels.queue}>`)] })
            if (!args[1]) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('You need to include a submission to deny.')] })
            if (db.spqueue[args[1]]) {
                delete db.spqueue[args[1]]

                fs.writeFileSync('./data/spqueue.json', JSON.stringify(db.spqueue))

                message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Submission denied.')] })


            } else {

                let submission = null;
                for (let i = 0; i < db.queue.length; i++) {
                    if (db.queue[i][4] === args[1]) {
                        submission = i
                    }
                }
                if (submission === null) { return message.reply({ embeds: [new MessageEmbed().setTitle('Error').setDescription('That submission is invalid, or no longer exists.')] }) }
                let chalname = db.queue[submission][0]
                try { client.users.fetch(message.channel.guild.members.fetch({ cache: false }).then(members => console.log(members.find(member => member.user.tag === db.queue[submission][3]).id))).then(e => { e.send({ embeds: [new MessageEmbed().setTitle('Sorry! :confused:').setDescription('Your challenge `' + chalname + '` was declined. Please message a moderator with any questions.').setTimestamp().setThumbnail(e.displayAvatarURL())] }).catch(e => { console.log(e) }) }) } catch {

                }
                delete db.queue[submission];
                db.queue = db.queue.filter(Boolean)
                fs.writeFileSync('./data/queue.json', JSON.stringify(db.queue))
                return message.channel.send({ embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription('Submission denied.')] })

            }
        })

    }
}