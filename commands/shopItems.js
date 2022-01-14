const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const prefix = require("../config.json").prefix;
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
module.exports = [
  {
    meta: {
      name: "Spotlight",
      desc: `Get a chance to advertise your creations in <#${db.channels.spotlight}> for all to see!`,
      cost: 10000,
    },
    purchase: {
      prereqs: [
        {
          condition: function (client, interaction, message, args, db, prefix) {
            return !!message.guild.members.cache
              .get(message.author.id)
              ._roles.includes(db.roles.spotlight);
          },
          response: function (client, interaction, message, args, db, prefix) {
            message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(
                    `You have spotlight perms. Post an ad in <#${db.channels.spotlight}> before buying another spotlight.`
                  ),
              ],
            });
          },
        },
      ],
      onpurchase: function (client, interaction, message, args, db, prefix) {
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
                ),
            ],
          })
          .catch((error) => {
            console.log(error);
          }); 
           

      },
    },
  },
  {
    meta: {
      name: "Hustler",
      desc: `Gain the **<@&${db.roles.hustler}>** role. Gives you a special color above everyone else, exclusive chat access, and the ability to react to more messages.`,
      cost: 50000,
    },
    purchase: {
      prereqs: [
        {
          condition: function (client, interaction, message, args, db, prefix) {
            return !!message.guild.members.cache
              .get(message.author.id)
              ._roles.includes(db.roles.hustler);
          },
          response: function (client, interaction, message, args, db, prefix) {
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
      onpurchase: function (client, interaction, message, args, db, prefix) {
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
  },

  {
    meta: {
      name: "Samplepacks",
      desc: `Purchase community made sample packs! Use ${"`"}${prefix}samplepacks / ${prefix}sp${"`"} for more details.`,
      cost: "Varied",
    },
  },
];
