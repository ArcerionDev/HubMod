module.exports = {
    name: 'eval',
    desc: 'Evaluate code passed to the bot in a message. Only usable by the bot creator.',
    aliases: ["eval"],
    input: ['code'],
    categories: [3],
    execute: function(client,message,args,db,prefix){
       
        args = message.content.split(' ')
        args.shift()

        if (message.author.id !== '683792601219989601') {
            message.reply(`you aren't the bot owner nerd`)
            return;
        }
        try {
            function clean(text) {
                if (typeof (text) === "string")
                    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
                else
                    return text;
            }
            const code = args.join(" ");
            let evaled = eval(code);

            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.reply(` \`\`\`js\n${clean(evaled)}\n\`\`\``);
        } catch (err) {
            message.reply(` \`\`\`js\n${clean(err)}\n\`\`\``);
        }

    }
}