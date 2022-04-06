const fs = require("fs");
const { MessageEmbed } = require("discord.js");

module.exports = {

    customids: ['picknew','acceptsample'],
    execute: function(client,interaction,db,prefix){
        let parsed = interaction.customId.split("_");
        if(parsed[0] === "picknew"){
            let sampleidx = JSON.parse(fs.readFileSync('./samples/sampleidx.json','utf-8'))
            let sample = sampleidx[~~(Math.random() * sampleidx.length)]
           interaction.message.removeAttachments().then(() => {

            interaction.message.edit({
            
                embeds: [new MessageEmbed()
                    .setTitle('New Sample Track Challenge')
                    .setDescription(`**Rewards**\n\nWinner(s): **${sample.w}** <:bling:693310674612387862>\n\nCreativity: **${sample.c}** <:bling:693310674612387862>\n\nEntry: **${sample.e}** <:bling:693310674612387862>\n\nThe sample for the challenge is attached above.`)
                    .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
                    .setFooter(interaction.message.embeds[0].footer.text)], 
                    components: [interaction.message.components[0]],
                    files: [sample.path]})

           })
           
                setTimeout(function(){interaction.deferUpdate().catch(e => { console.log(e) }) }, 2000)
        
            }

            if(parsed[0] === "acceptsample"){

                interaction.message.edit({
            
                    embeds: [new MessageEmbed()
                        .setTitle('New Sample Track Challenge')
                        .setDescription(interaction.message.embeds[0].description)
                        .setThumbnail('https://cdn.discordapp.com/icons/480487206721552405/f15eaef39eecccfd7f60f8e1a9ae98c3.webp?size=512')
                        .setFooter(interaction.message.embeds[0].footer.text)], 
                        components: [],
                    
                    })
    
                    interaction.deferUpdate().catch(e => { console.log(e) })

            }

    }
};