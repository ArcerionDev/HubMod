const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {
    customids: ["1", "2", "3"],

    execute: function (client, interaction, db, prefix) {

        if (!db.votes.inprogress)
            return interaction
                .reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("Error")
                            .setDescription(`Vote is not currently in progress.`),
                    ],
                   ephemeral: [true],
                })
                .catch((error) => {
                    console.log(error);
                });
        db.votes = JSON.parse(fs.readFileSync("./data/votes.json", "utf-8"));

        let hasVoted = false;

        Object.keys(db.votes.votes).forEach((e) => {
            if (db.votes.votes[e].includes(interaction.user.id)) {
                hasVoted = e;
            }
        });
        if (hasVoted) {
            delete db.votes.votes[hasVoted][
                db.votes.votes[hasVoted].indexOf(interaction.user.id)
            ];

            db.votes.votes[hasVoted] = db.votes.votes[hasVoted].filter(Boolean);
        }

        db.votes.votes[interaction.customId].push(interaction.user.id);

        fs.writeFileSync("./data/votes.json", JSON.stringify(db.votes));

        return interaction
            .reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Success! :tada:")
                        .setDescription(
                            `${hasVoted ? "Recasted" : "Casted"} your vote for **${interaction.customId}**.`
                        ),
                ],
                ephemeral: [true],
            })
            .catch((error) => {
                console.log(error);
            });

    }
};
