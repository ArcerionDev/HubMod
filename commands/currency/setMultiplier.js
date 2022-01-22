const logger = require("../../utils/logger");
const {MessageEmbed} = require('discord.js')
module.exports = {
    name: "setMultiplier",
    desc: "Set the multiplier for bling chat rewards. Default is `1`. Only usable by moderators.",
    aliases: ["sm",'setMultiplier'],
    input: ["amount"],
    categories: ["currency"],
    execute: function(client, message, args, db, prefix){

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
              })
            
              if (!args[1])
              return message.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle("Invalid")
                    .setDescription(`<@${message.author.id}>, provide a value to set the multiplier to.`),
                ],
              });

              if(isNaN(args[1])) return message.reply({ embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(`<@${message.author.id}>, provide a real number to set the multiplier to.`),
              ],})

              if(parseInt(args[1] < 1)) return message.reply({ embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(`<@${message.author.id}>, provide a number equal to 1 or over to set the multiplier to.`),
              ],})

              this.multiplier = parseInt(args[1])

              logger.log(
                {
                  action: "setMulti",
                  channel: message.channel.id,
                  desc: `<@${message.author.id}> set the chat multiplier to ${args[1]}.`,
                  executor: message.author.id,
                  url: message.url,
                },
                client,
                db
              );

              return message.reply({ embeds: [
                new MessageEmbed()
                  .setTitle("Success! :tada:")
                  .setDescription(`Chat multiplier set to ${'`'}${args[1]}${'`'}`),
              ],})

            })

    }
}