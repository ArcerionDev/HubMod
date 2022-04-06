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
    name: "Hustler",
    id: "hustler",
    desc: `Gain the **<@&${db.roles.hustler}>** role. Gives you a special color above everyone else, exclusive chat access, and the ability to react to more messages.`,
    displayCost: 50000,
    cost: 50000,
    amount: false,
  },
  purchase: {
    prereqs: [
      {
        condition: function (client, interaction, message, args, db, prefix, amount) {
          return !!message.guild.members.cache
            .get(message.author.id)
            ._roles.includes(db.roles.hustler);
        },
        response: function (client, interaction, message, args, db, prefix, amount) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("Invalid")
                .setDescription(`You already have the Hustler role.`),
            ],
          });
        },
      },
    ],
    onpurchase: function (client, interaction, message, args, db, prefix, amount) {
      interaction.guild.members.cache
        .get(interaction.user.id)
        .roles.add(db.roles.hustler);
      interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Success! :tada:")
              .setDescription("The Hustler role was successfully purchased."),
          ],
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
