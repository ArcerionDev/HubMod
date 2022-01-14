const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const logger = require("../../utils/logger");
module.exports = {
  name: "add",
  desc: "Add an amount to a user's balance. Only usable by moderators.",
  aliases: ["add", "give"],
  input: ["@user", "amount"],
  categories: [1],
  execute: function (client, message, args, db, prefix) {
    message.guild.members.fetch(message.author.id).then(async (e) => {
      if (!e.permissions.has("32"))
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(
                `<@${message.author.id}>, you don't have permission to run this command.`
              ),
          ],
        });

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
                `<@${message.author.id}>, provide an amount to add to this user's balance.`
              ),
          ],
        });

      args[2] = args[2].replaceAll("k", "000");

      let hasNonNum = false;

      let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
      args[2].split("").forEach((e) => {
        if (!numbers.includes(e)) {
          hasNonNum = true;
        }
      });
      if (hasNonNum)
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

      if (db.blingdata[subject]) {
        db.blingdata[subject] = db.blingdata[subject] + parseInt(args[2]);
      } else {
        db.blingdata[subject] = parseInt(args[2]);
      }
      fs.writeFileSync(
        "./data/currencystore.json",
        JSON.stringify(db.blingdata)
      );

      logger.log(
        {
          action: "blingAdd",
          user: subject,
          channel: message.channel.id,
          desc: `<@${message.author.id}> added ${args[2]} bling to <@${subject}>'s balance.`,
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
              `Successfully gave ${args[2]} bling to <@${subject}>.`
            ),
        ],
      });
    });
  },
};
