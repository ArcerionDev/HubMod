const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const fs = require('fs')
module.exports = {
    name: "sv",
    desc: "Start a challenge vote. Only usable by moderators.",
    aliases: ['startvote','sv'],
    categories: [0],
    execute: function(client,message,args,db,prefix){

        message.guild.members.fetch(message.author.id).then(fetchUser => {
            if (message.channel.id != db.channels.ccvote) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`That command can only be executed in <#${db.channels.ccvote}>.`)] })

            if (fetchUser.permissions.has('32') || message.author.id === "683792601219989601") {



                if (db.votes.inprogress) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription('A vote is already in process, use `'+prefix+'endvote / '+prefix+'ev` to end it.')] })


                if (db.ccs.length < 3) return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`There aren't enough challenges in the database to start a vote.`)] })

                // status: unsure if I'm even going to be able to figure out how to start, help

                let votables = db.ccs.slice(0, 3) // get first 3 challenges

                db.votes.inprogress = true

                db.votes.challenges = []

                db.votes.challenges.push(votables)


                Object.keys(db.votes.votes).forEach(x => {
                    db.votes.votes[x] = []
                })


                for (let i = 0; i < 3; i++) {

                    db.ccs.sort( () => .5 - Math.random() ); // do this later, we don't want to fuck anything up while testing

                    // push those to the back as they've been in the vote

                }

                fs.writeFileSync('./data/communitychallenges.json', JSON.stringify(db.ccs))

                fs.writeFileSync('./data/votes.json', JSON.stringify(db.votes))



                let voteemb = new MessageEmbed()
                    .setTitle('Weekly Challenges - Vote') // will change weekly to whatever is decided for a good challenge interval
                    .setDescription(`Vote for a challenge to do below!`)
                    .setThumbnail(`https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`)
                    .setFooter('Bot developed by Arcerion#7298 🖤')
                    .setTimestamp()

                let one = new MessageButton()
                    .setCustomId('one')
                    .setLabel('1')
                    .setStyle('PRIMARY')
                let two = new MessageButton()
                    .setCustomId('two')
                    .setLabel('2')
                    .setStyle('PRIMARY')
                let three = new MessageButton()
                    .setCustomId('three')
                    .setLabel('3')
                    .setStyle('PRIMARY')

                let votebtns = new MessageActionRow()
                    .addComponents(
                        one,
                        two,
                        three
                    );

                for (let i = 0; i < 3; i++) {

                    voteemb.addField(`**${i + 1}** •  ${votables[i][0]} • Team members - ${votables[i][2]}`, `${votables[i][1]} • Submitted by ${votables[i][3]}`, false)


                }
                message.channel.send({ embeds: [voteemb], components: [votebtns] })

               

            } else {
                return message.reply({ embeds: [new MessageEmbed().setTitle('Invalid').setDescription(`Sorry, you don't have permission to run this command.`)] })
            }
        })

    }
}