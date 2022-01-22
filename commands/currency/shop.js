const { MessageEmbed } = require("discord.js");
const fs = require("fs");
let shopItems = [];
fs.readdirSync("./items").forEach((i) => {
  shopItems.push(require(`../../items/${i}`));
});

module.exports = {
  name: "shop",
  desc: "Get a list of things you can buy with your bling.",
  aliases: ["shop"],
  categories: ["currency"],
  execute: function (client, message, args, db, prefix) {
    let shop = new MessageEmbed()
      .setTitle("The Bling Shop")
      .setDescription(
        "Buy perks and items with the command `" + prefix + "buy [item]`"
      );
    (shopItems.sort((a,b) => {return b.meta.cost - a.meta.cost})).forEach((i) => {
      shop.addField(
        `<:bling:693310674612387862> ${
          typeof i.meta.displayCost === "number"
            ? JSON.stringify(i.meta.displayCost).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : i.meta.displayCost
        } - ${i.meta.name} ${i.meta.id ? `${'`'}(${i.meta.id})${'`'}` : ''}`,
        i.meta.desc
      );
    });
    message.channel.send({embeds: [shop]})
  },
};
