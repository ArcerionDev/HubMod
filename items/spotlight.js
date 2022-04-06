const fs = require("fs");
const { MessageEmbed } = require("discord.js");
let db = {};
db.blingdata = JSON.parse(
  fs.readFileSync("./data/currencystore.json", "utf-8")
);
db.channels = JSON.parse(fs.readFileSync("./data/channels.json", "utf-8"));
db.ccs = JSON.parse(
  fs.readFileSync("./data/communitychallenges.json", "utf-8")
);
db.roles = JSON.parse(fs.readFileSync("./data/roles.json", "utf-8"));
db.votes = JSON.parse(fs.readFileSync("./data/votes.json", "utf-8"));
db.queue = JSON.parse(fs.readFileSync("./data/queue.json", "utf-8"));
db.spqueue = JSON.parse(fs.readFileSync("./data/spqueue.json", "utf8"));
db.samplepacks = JSON.parse(fs.readFileSync("./data/samplepacks.json", "utf8"));
module.exports = {
  meta: {
    name: "Spotlight",
    id: "spotlight",
    desc: `Get a chance to advertise your creations in <#${db.channels.spotlight}> for all to see!`,
    displayCost: 10000,
    cost: 10000,
    amount: false,
    },
  purchase: {
    prereqs: [
      {
        condition: function (client, interaction, message, args, db, prefix, amount) {
          return !!message.guild.members.cache
            .get(message.author.id)
            ._roles.includes(db.roles.spotlight);
        },
        response: function (client, interaction, message, args, db, prefix, amount) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("Invalid")
                .setDescription(
                  `You have spotlight perms. Post an ad in <#${db.channels.spotlight}> before buying another spotlight.`
                )
            ]
          });
        }
      }
    ],
    onpurchase: function (client, interaction, message, args, db, prefix, amount) {
      interaction.guild.members.cache
        .get(interaction.user.id)
        .roles.add(db.roles.spotlight);
      interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Success! :tada:")
              .setDescription(
                `A spotlight was successfully purchased. You now have permission to send one message in <#${db.channels.spotlight}>`
              )
          ]
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
