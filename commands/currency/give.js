const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const logger = require("../../utils/logger");
module.exports = {

    //initialize with command give and alias give
    name: "give",
    desc: "Give an amount to a user, at the cost of losing the amount from your balance.",
    aliases: ["give"],
    input: ["@user", "amount"],
    categories: ["currency"],
    execute: async function (client, message, args, db, prefix) {
        if (!args[1])
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription(`<@${message.author.id}>, provide a user.`),
          ],
        });
        if (!args[2])
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription(
                `<@${message.author.id}>, provide an amount to give to this user.`
              ),
          ],
        });

        args[2] = args[2].replaceAll("k", "000");

        if (isNaN(args[2]))
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("Invalid")
                .setDescription(
                  `<@${message.author.id}>, provide a real number.`
                ),
            ],
          });
          if (parseInt(args[2]) < 1) {
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(
                    `<@${message.author.id}>, provide a number greater than 0.`
                  ),
              ],
            });
          }
          if (db.blingdata[message.author.id] < parseInt(args[2]))
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription(
                `<@${message.author.id}>, you don't have enough money to give that amount.`
              ),
          ],
        });

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
        db.blingdata[subject] = (db.blingdata[subject] ? db.blingdata[subject] + parseInt(args[2]) : parseInt(args[2]))
        db.blingdata[message.author.id] = db.blingdata[message.author.id] - parseInt(args[2]);
        fs.writeFileSync(
            "./data/currencystore.json",
            JSON.stringify(db.blingdata)
          );
        logger.log(
            {
              action: "blingGive",
              user: subject,
              channel: message.channel.id,
              desc: `<@${message.author.id}> transferred ${args[2].replace(/\B(?=(\d{3})+(?!\d))/g, ",")} bling from themself to <@${subject}>.`,
              executor: message.author.id,
              url: message.url,
            },
            client,
            db
          );
          message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle("Success! :tada:")
                .setDescription(
                  `Successfully transferred ${args[2].replace(/\B(?=(\d{3})+(?!\d))/g, ",")} bling to <@${subject}>.`
                ),
            ],
          });
    }

}