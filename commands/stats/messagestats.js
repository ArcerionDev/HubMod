const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messagestats",
  desc: "Get info on a user's contribution to the total daily 30s, or get a leaderboard of the top contributors.",
  aliases: ["ms", "messagestats"],
  input: ["user (optional)"],
  categories: ["stats"],
  execute: async function (client, message, args, db, prefix) {
    let messagedata = JSON.parse(fs.readFileSync("./data/stats/messages.json"));

    if (!args[1]) {
        message.guild.members.fetch().then(users => {
        let formatted = Object.keys(messagedata).map((k) => [k, messagedata[k]]).sort((a,b) => b[1]-a[1])
        formatted.length = 10
        formatted = formatted.map((a,index) => {
            
            let hasMatch = false

            Array.from(users).forEach(u => {
                if(u[0] === a[0]){
                    hasMatch = `**#${index+1}:** ${u[1].user.tag} • ${a[1]} messages`

                }

            })
        return (hasMatch ? hasMatch : `**#${index+1}:** ${a[0]} • ${a[1]} messages`)
        
        })
        message.channel.send({embeds: [

            new MessageEmbed()
            .setTitle('Producer Hub Message Leaderboard')
            .setDescription(formatted.join('\n\n'))
            .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
            .setFooter(`Your leaderboard rank: ${messagedata[message.author.id] ? Object.keys(messagedata).map((k) => [k, messagedata[k]]).sort((a,b) => b[1]-a[1]).findIndex((e) => e[0] === message.author.id) + 1 + (["st", "nd", "rd"][ ((Object.keys(messagedata).map((k) => [k, messagedata[k]]).sort((a,b) => b[1]-a[1]).findIndex((e) => e[0] === message.author.id) + 1 + (90 % 100) - 10) % 10) - 1 ] || "th") : 'N/A'}`)
        ]})
    })
    } else {
      let subject = null;

      if (args[1].match(/(\d+)/)) {
        subject = args[1].match(/(\d+)/)[0];
      } else {
        let user = Array.from(await await message.guild.members.fetch()).find(
          (u) => u[1].displayName.toLowerCase().includes(args[1])
        );

        if (user) {
          subject = user[1].id;
        }
      }

      if (!subject)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription(`<@${message.author.id}>, provide a valid user.`),
          ],
        });

      if (!messagedata[subject])
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(`No data was found for this user.`),
          ],
        });
      let user = await client.users.fetch(subject);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.tag}'s message stats`)
            .setDescription(
              `${user.username} has sent **${
                messagedata[subject]
              }** messages, contributing to **${Math.round(
                (messagedata[subject] /
                  Object.values(messagedata).reduce((a, b) => a + b)) *
                  100
              )}%** out of a total of **${Object.values(messagedata).reduce(
                (a, b) => a + b
              )}** messages sent from the current users of the server, putting them in ${
                Object.keys(messagedata)
                  .map((k) => [k, messagedata[k]]).sort((a,b) => b[1]-a[1])
                  .findIndex((e) => e[0] === subject) +
                1 +
                (["st", "nd", "rd"][
                  ((Object.keys(messagedata)
                    .map((k) => [k, messagedata[k]]).sort((a,b) => b[1]-a[1])
                    .findIndex((e) => e[0] === subject) +
                    1 +
                    (90 % 100) -
                    10) %
                    10) -
                    1
                ] || "th")
              } place.`
            )
            .setImage(
              `https://quickchart.io/chart?c=${encodeURI(
                JSON.stringify({
                  type: "doughnut",
                  data: {
                    labels: [user.username, "Total"],
                    datasets: [
                      {
                        data: [
                            messagedata[subject],
                          Object.values(messagedata).reduce((a, b) => a + b),
                        ],
                      },
                    ],
                  },
                  options: {
                    plugins: {
                      doughnutlabel: {
                        labels: [
                          {
                            text: Object.values(messagedata).reduce(
                              (a, b) => a + b
                            ),
                            font: { size: 20 },
                          },
                          { text: "total" },
                        ],
                      },
                    },
                  },
                })
              )}`
            ),
        ],
      });
    }
  },
};
