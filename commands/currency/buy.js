const fs = require("fs");
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
let shopItems = []
fs.readdirSync('./items').forEach(i => {
    shopItems.push(require(`../../items/${i}`))

});
module.exports = {
  name: "buy",
  desc: "Buy an item from the shop.",
  aliases: ["buy"],
  input: ["item"],
  categories: ["currency"],
  execute: function (client, message, args, db, prefix) {
    args = message.content.split(" ");
    if (!args[1])
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Invalid")
            .setDescription("Provide something to buy."),
        ],
      });

    if (db.samplepacks[args[1]]) {
      // buying samplepacks = special case
      require("../../utils/buySamplepack")(client, null, message, args, db, prefix);
    } else {
      let toBuy = shopItems.find(
        (i) => i.meta.id.toLowerCase() === args[1].toLowerCase()
      );
     
      if (!toBuy || !toBuy.purchase)
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription("Please enter a valid item to buy."),
          ],
        });

        if (toBuy.meta.amount) {
          if (!args[2])
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(
                    `Please specify the amount of ${toBuy.meta.name}s you would like to buy.`
                  ),
              ],
            });

          if (isNaN(args[2]))
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setTitle("Invalid")
                  .setDescription(
                    `<@${message.author.id}>, provide a valid amount.`
                  ),
              ],
            });
            
        }
        if (db.blingdata[message.author.id] < (toBuy.meta.amount ? toBuy.meta.cost * args[2] : toBuy.meta.cost))
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid")
              .setDescription(`You don't have enough money to buy this.`),
          ],
        });
      let meetsPrereqs = true;

      toBuy.purchase.prereqs.every((p) => {
        if (!!p.condition(client, null, message, args, db, prefix, (toBuy.meta.amount ? parseInt(args[2]) : null))) {
          p.response(client, null, message, args, db, prefix, (toBuy.meta.amount ? parseInt(args[2]) : null));
          meetsPrereqs = false;
          return false;
        } else {
          return true;
        }
      });

      if (!meetsPrereqs) return;

      let y = new MessageButton()
        .setCustomId(`confirmPurchase_${message.author.id}_${toBuy.meta.id}_${args[2] ? args[2] : 1}`)
        .setLabel("Yes")
        .setStyle("SUCCESS");
      let n = new MessageButton()
        .setCustomId(`denyPurchase_${message.author.id}_${toBuy.meta.id}_${args[2] ? args[2] : 1}`)
        .setLabel("No")
        .setStyle("SECONDARY");

      let yn = new MessageActionRow().addComponents(y, n);

      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Confirmation")
            .setDescription(
              `Are you sure you want to buy ${toBuy.meta.amount ? args[2]+' ' : ' '}${"`"}${toBuy.meta.name}${"`"}${toBuy.meta.amount ? '(s)' : ''} for ${'`'}${JSON.stringify((toBuy.meta.amount ? toBuy.meta.cost * parseInt(args[2]) : toBuy.meta.cost)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}${'`'}?`
            ),
        ],
        components: [
          yn
        ]
      });

      /*db.blingdata[message.author.id] =
        db.blingdata[message.author.id] - toBuy.meta.cost;
      fs.writeFileSync(
        "./data/currencystore.json",
        JSON.stringify(db.blingdata)
      );

      toBuy.purchase.onpurchase(client, message, args, db, prefix);*/
    }
  },
};
