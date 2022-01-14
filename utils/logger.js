const fs = require('fs')

const {MessageEmbed} = require('discord.js')

module.exports = {

    log: function(payload, client, db){

        // payload subproperties:

        // action, user, desc, executor (optional)

        let path = `./logs/${payload.action}/${payload.user ? payload.user : payload.executor}/${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}.${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}.json`
        
        let parsed = path.split('/')
        parsed.pop()
       parsed = parsed.slice(2)
    
        let valids = []
    
        parsed.forEach((d) => {
    
            if(!fs.existsSync(`./logs/${valids.join('/')}/${d}/`)){
    
                fs.mkdirSync(`./logs/${valids.join('/')}/${d}/`)
    
            }
            valids.push(d)
        })
    
        fs.writeFileSync(path,JSON.stringify(payload))
    
        let logemb = new MessageEmbed()
        .setTitle(`New ${payload.action} action`)
        .setDescription(`${payload.executor ? `executed by <@${payload.executor}> ` : ''}${payload.user ? `for user <@${payload.user}>` : ``}${payload.channel ? ` in <#${payload.channel}>` : ''}\n\n${payload.desc}\n\n${payload.url ? `[**Jump to message**](${payload.url})\n\n` : ''}Logged <t:${Math.round(Date.now()/1000)}:R>`)
       .setFooter(`Log path: ${path}`)

       client.channels.fetch(db.channels.logs).then(c => {

        c.send({embeds: [logemb],files:[path]})

       })
    }

}