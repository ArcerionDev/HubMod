const fs = require("fs");
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const logger = require("./logger");

module.exports = function (client, interaction, message, args, db, prefix) {
  let data = db.samplepacks[args[1]];

  if (message.author.id === data.author)
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Invalid")
          .setDescription(
            `You can't buy your own samplepack. DM <@683792601219989601> if you forgot the download URL.`
          ),
      ],
    });
  if (db.samplepacks[args[1]].buyers.includes(message.author.id))
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Invalid")
          .setDescription(
            `You've already bought this samplepack. Check DMs with <@${client.user.id}> for the download URL.`
          ),
      ],
    });
  if (!db.blingdata[message.author.id])
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Invalid")
          .setDescription(
            `You don't have enough money to buy this samplepack.`
          ),
      ],
    });
  if (
    JSON.stringify(db.blingdata[message.author.id] - data.value).startsWith("-")
  )
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Invalid")
          .setDescription(
            `You don't have enough money to buy this samplepack.`
          ),
      ],
    });

    let y = new MessageButton()
    .setCustomId(`confirmPurchase_${message.author.id}_${data.id}`)
    .setLabel("Yes")
    .setStyle("SUCCESS");
  let n = new MessageButton()
    .setCustomId(`denyPurchase_${message.author.id}_${data.id}`)
    .setLabel("No")
    .setStyle("SECONDARY");

  let yn = new MessageActionRow().addComponents(y, n);

  message.channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Confirmation")
        .setDescription(
          `Are you sure you want to buy the samplepack ${"`"}${data.title} (${data.id})${"`"} for ${'`'}${data.value}${'`'}?`
        ),
    ],
    components: [
      yn
    ]
  });

  /*
        db.blingdata[message.author.id] =
          db.blingdata[message.author.id] - data.value;
        db.blingdata[data.author] = db.blingdata[data.author] + data.value;
        db.samplepacks[args[1]].buyers.push(message.author.id);
        fs.writeFileSync(
          "./data/currencystore.json",
          JSON.stringify(db.blingdata)
        );
        fs.writeFileSync(
          "./data/samplepacks.json",
          JSON.stringify(db.samplepacks)
        );
        message
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
              channel: message.channel.id,
              desc: `<@${message.author.id}> bought <@${data.author}>'s samplepack ${data.title} (${data.id}) for ${data.value} bling.`,
              executor: message.author.id,
              url: message.url,
            },
            client,
            db
          );
        
        message.author
          .send({
            embeds: [
              new MessageEmbed()
                .setTitle(
                  `${message.author.tag}, your purchased samplepack has been delivered. :bangbang:`
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
                  `You've recieved ${data.value} bling from ${message.author.tag}'s purchase of your samplepack ${data.title}. This is purchase #${data.buyers.length} of this samplepack.`
                )
                .setThumbnail(
                  `https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512`
                ),
            ],
          }).catch((error) => {
            console.log(error);
          });
        });
        */
};
