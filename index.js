require('module-alias/register')
require('dotenv');
const prefix = process.env.BOT_PREFIX;

const { Client, Collection, MessageEmbed, Util } = require('discord.js')

const client = new Client({
    disableEveryone: true
})

client.on('message', async ( message ) => {

    if(message.author.bot) return;
    if(!message.guild) return;
    if(!message.content.startsWith(prefix) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd === 'steal') {

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(':x: Invalid permissions.')
        if(!message.guild.me.hasPermission("MANAGE_EMOJIS")) return message.channel.send(':x: Bot has invalid permissions.')
        if(!args.length) return message.channel.send(':x: Please include 1 or more emojis.')

        for (const rawEmoji of args) {
            const parsedEmoji = Util.parseEmoji(rawEmoji);

            if(parsedEmoji.id) {
                const extension = parsedEmoji.animated? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;

                message.guild.emojis.create(url, parsedEmoji.name).catch((err) => {
                    message.channel.send(':x: Guild has hit maximum emoji limit (50).')
                    return;
                })
                    .then((emoji) => message.channel.send(`:white_check_mark: New emoji successfully added to guild!\n\n**Emoji:** :${emoji.name}:`))
            }
        }

    }

})

client.on('ready', async ( ) => {
    client.user.setPresence({ 
        activity: { 
            name: `${prefix}steal`,
            type : 'LISTENING',
        }, status: 'dnd' 
    })

    console.log('Bot has logged in!')
})

client.login(process.env.BOT_TOKEN)
