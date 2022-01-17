const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const logger = require("../utils/logger");
let shopItems = []
fs.readdirSync('./items').forEach(i => {
    shopItems.push(require(`../items/${i}`))

})
module.exports = {
  customids: ["confirmPurchase", "denyPurchase"],
  execute: function (client, interaction, db, prefix) {
    let parsed = interaction.customId.split("_");

    if (interaction.user.id != parsed[1]) {
      return interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription("It's not your message."),
          ],
          ephemeral: [true],
        })
        .catch((error) => {
          console.log(error);
        });
    }

    if (!parsed[2])
      return interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(
                "There was an issue processing the purchase. Your bling hasn't been altered."
              ),
          ],
          ephemeral: [true],
        })
        .catch((error) => {
          console.log(error);
        });

    let toBuy = shopItems.find(
      (i) => i.meta.name.toLowerCase() === parsed[2].toLowerCase()
    );

    if(!db.samplepacks[parsed[2]]){

      if (!toBuy || !toBuy.purchase)
      return interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Error")
              .setDescription(
                `There was a problem finding the shop item you were looking for. Use ${"`"}${prefix}shop${"`"} to see if it was removed.`
              ),
          ],
          ephemeral: [true],
        })
        .catch((error) => {
          console.log(error);
        });

    }

    let id = interaction.customId.slice(0).split("_")[0];

    if (id === "confirmPurchase") {
      if (db.samplepacks[parsed[2]]) {
        let data = db.samplepacks[parsed[2]];
      
        db.blingdata[interaction.user.id] =
        db.blingdata[interaction.user.id] - data.value;
      db.blingdata[data.author] = db.blingdata[data.author] + data.value;
      db.samplepacks[parsed[2]].buyers.push(interaction.user.id);
      fs.writeFileSync(
        "./data/currencystore.json",
        JSON.stringify(db.blingdata)
      );
      fs.writeFileSync(
        "./data/samplepacks.json",
        JSON.stringify(db.samplepacks)
      );
      interaction
        .reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Success! :tada:")
              .setDescription(
                `Successfully bought ${data.title} for ${data.value} bling. Check your DMs for a download URL.`
              ),
          ],
        })
        .catch((error) => {
          console.log(error);
        });

        logger.log(
          {
            action: "buySamplepack",
            channel: interaction.channel.id,
            desc: `<@${interaction.user.id}> bought <@${data.author}>'s samplepack ${data.title} (${data.id}) for ${data.value} bling.`,
            executor: interaction.user.id,
            url: interaction.message.url,
          },
          client,
          db
        );
      
      interaction.user
        .send({
          embeds: [
            new MessageEmbed()
              .setTitle(
                `${interaction.user.tag}, your purchased samplepack has been delivered. :bangbang:`
              )
              .setDescription(`Direct download URL - ${data.url}`)
              .setThumbnail(
                `https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`
              ),
          ],
        })
        .catch((error) => {
          console.log(error);
        });
      client.users.fetch(data.author).then((e) => {
        e.send({
          embeds: [
            new MessageEmbed()
              .setTitle(
                `${e.tag}, your samplepack ${data.title} was purchased. :bangbang:`
              )
              .setDescription(
                `You've recieved ${data.value} bling from ${interaction.user.tag}'s purchase of your samplepack ${data.title}. This is purchase #${data.buyers.length} of this samplepack.`
              )
              .setThumbnail(
                `https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`
              ),
          ],
        }).catch((error) => {
          console.log(error);
        });
      });

      }else{

        db.blingdata[interaction.user.id] =
        db.blingdata[interaction.user.id] - toBuy.meta.cost;
      fs.writeFileSync(
        "./data/currencystore.json",
        JSON.stringify(db.blingdata)
      );
      toBuy.purchase.onpurchase(client, interaction, null, null, db, prefix)
    interaction.message.components[0].components[0].setDisabled(true);
    interaction.message.components[0].components[1].setDisabled(true);
     interaction.message.edit({
        embeds: [interaction.message.embeds[0]],
        components: [interaction.message.components[0]],
      })
      
      logger.log(
        {
          action: "buyItem",
          channel: interaction.channel.id,
          desc: `<@${interaction.user.id}> bought the shop item ${toBuy.meta.name} for ${toBuy.meta.cost}.`,
          executor: interaction.user.id,
          url: interaction.url,
        },
        client,
        db
      );

      }
    }

    if (id === "denyPurchase") {
      interaction.message.components[0].components[0].setDisabled(true);
      interaction.message.components[0].components[1].setDisabled(true);
      interaction.deferUpdate();
      interaction.message.edit({
        embeds: [interaction.message.embeds[0]],
        components: [interaction.message.components[0]],
      });

      interaction.message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Alright.")
            .setDescription("Run the command again if you change your mind."),
        ],
      });
    }
  },
};
