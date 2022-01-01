const fs = require('fs')
const {MessageEmbed} = require('discord.js');

module.exports = {

    customids: ['one','two','three'],

    execute: function(client,interaction,db,prefix){

        if (interaction.customId === "one") {
            if(!db.votes.inprogress) return client.api.interactions(interaction.id, interaction.token).callback.post({
              data: {
                  type: 4,
                  data: {
                      embeds: [new MessageEmbed().setTitle('Error').setDescription(`Vote is not currently in progress.`)],
                      flags: 64,
                  }
              }
          }).catch(error => { console.log(error) })
              db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
      
              let hasVoted = false
      
              Object.keys(db.votes.votes).forEach(e => {
                  if (db.votes.votes[e].includes(interaction.user.id)) {
                      hasVoted = e
      
                  }
              })
              if (hasVoted) {
      
                  delete db.votes.votes[hasVoted][db.votes.votes[hasVoted].indexOf(interaction.user.id)]
      
                  db.votes.votes[hasVoted] = db.votes.votes[hasVoted].filter(Boolean)
      
              }
      
      
              db.votes.votes["1"].push(interaction.user.id)
      
              fs.writeFileSync('./data/votes.json', JSON.stringify(db.votes))
      
      
              return client.api.interactions(interaction.id, interaction.token).callback.post({
                  data: {
                      type: 4,
                      data: {
                          embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`${hasVoted ? 'Recasted' : "Casted"} your vote for **1**.`)],
                          flags: 64,
                      }
                  }
              }).catch(error => { console.log(error) })
      
          }
          if (interaction.customId === "two") {
                  if(!db.votes.inprogress) return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds: [new MessageEmbed().setTitle('Error').setDescription(`Vote is not currently in progress.`)],
                            flags: 64,
                        }
                    }
                }).catch(error => { console.log(error) })
            db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
      
              let hasVoted = false
      
              Object.keys(db.votes.votes).forEach(e => {
                  if (db.votes.votes[e].includes(interaction.user.id)) {
                      hasVoted = e
      
                  }
              })
              if (hasVoted) {
      
                  delete db.votes.votes[hasVoted][db.votes.votes[hasVoted].indexOf(interaction.user.id)]
      
                  db.votes.votes[hasVoted] = db.votes.votes[hasVoted].filter(Boolean)
      
              }
      
      
              db.votes.votes["2"].push(interaction.user.id)
      
              fs.writeFileSync('./data/votes.json', JSON.stringify(db.votes))
      
              return client.api.interactions(interaction.id, interaction.token).callback.post({
                  data: {
                      type: 4,
                      data: {
                          embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`${hasVoted ? 'Recasted' : "Casted"} your vote for **2**.`)],
                          flags: 64,
                      }
                  }
              }).catch(error => { console.log(error) })
      
          }
          if (interaction.customId === "three") {
                  if(!db.votes.inprogress) return client.api.interactions(interaction.id, interaction.token).callback.post({
                    data: {
                        type: 4,
                        data: {
                            embeds: [new MessageEmbed().setTitle('Error').setDescription(`Vote is not currently in progress.`)],
                            flags: 64,
                        }
                    }
                }).catch(error => { console.log(error) })
              db.votes = JSON.parse(fs.readFileSync('./data/votes.json', 'utf-8'))
      
              let hasVoted = false
      
              Object.keys(db.votes.votes).forEach(e => {
                  if (db.votes.votes[e].includes(interaction.user.id)) {
                      hasVoted = e
      
                  }
              })
              if (hasVoted) {
      
                  delete db.votes.votes[hasVoted][db.votes.votes[hasVoted].indexOf(interaction.user.id)]
      
                  db.votes.votes[hasVoted] = db.votes.votes[hasVoted].filter(Boolean)
      
              }
      
      
              db.votes.votes["3"].push(interaction.user.id)
      
              fs.writeFileSync('./data/votes.json', JSON.stringify(db.votes))
      
              return client.api.interactions(interaction.id, interaction.token).callback.post({
                  data: {
                      type: 4,
                      data: {
                          embeds: [new MessageEmbed().setTitle('Success! :tada:').setDescription(`${hasVoted ? 'Recasted' : "Casted"} your vote for **3**.`)],
                          flags: 64,
                      }
                  }
              }).catch(error => { console.log(error) })
          }
      
      

    }

}