const fs = require('fs')

const {MessageEmbed} = require('discord.js')

module.exports = function(client){

    process.on('uncaughtException', exception => {
        console.log(exception)
        if (exception.path) {
            client.users.fetch('683792601219989601').then(u => {
                let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
                let path = `./errorlogs/${new Date().getFullYear()}/${months[new Date().getMonth()]}/${new Date().getDate()}/${`${new Date().getHours()}.${new Date().getMinutes()}.${new Date().getSeconds()}`}.json`
    
                let parsed = path.split('/')
                parsed.pop()
               parsed = parsed.slice(2)
    
                let valids = []
    
                parsed.forEach((d) => {
    
                    if(!fs.existsSync(`./errorlogs/${valids.join('/')}/${d}/`)){
    
                        fs.mkdirSync(`./errorlogs/${valids.join('/')}/${d}/`)
    
                    }
                    valids.push(d)
                })
    
                fs.writeFileSync(path,JSON.stringify(exception))
    
                const errorEmbed = new MessageEmbed().setTitle(`An error occurred.`)
                    .setDescription(` \`\`\`javascript\n${exception.name}\n${exception.message}\n\`\`\`\nError occurred at ${exception.path}.`)
                    .addField(`Method`, exception.method, true)
                    .addField(`Status`, JSON.stringify(exception.httpStatus), true)
                    .addField(`Code`, JSON.stringify(exception.code), true);
    
                u.send({ embeds: [errorEmbed], files: [path] })
    
            })
    
        }
    
    
    
    })

}