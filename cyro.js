const {Discord, Client, Collection, MessageEmbed, Intents, Permissions} = require('discord.js')
const data = require('apollo.data')
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
    allowedMentions: {
        repliedUser: false,
        parse: ['users', 'roles']
    }
})


const config = JSON.parse(data.read(`configuration.json`))
const fs = require('fs')
const path = require('path')
module.exports = client;
client.commands = new Collection()
var cmds = []

//commands
const commands = fs.readdirSync(path.resolve('./commands')).filter(file => file.endsWith(`.js` || `.ts`))
console.log('Starting Xero...')
for (const file of commands){
    const command = require(`./commands/` + file)
    try {
    client.commands.set(command.data.name, command)
    cmds.push(command.data)
}
    catch(err) {
        console.error(err)
    }
}
console.log(`Loaded commands.`)

client.on('ready', () => {  
    console.log(`Logged in`)
    try {
        var link = null
        if(config.url){
            link = config.url
        }
      client.user.setPresence({ activities: [{ name: config.status_message, type: config.status_type, url: link }] });  
    } catch(err) {
        console.error(err)
    }
})
//slash commands
client.on(`interactionCreate`, async interaction => {
    if(interaction.isCommand()){
        if(interaction.guild){
        if(!interaction.guild.members.cache.get(client.user.id).permissions.has([Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.USE_EXTERNAL_EMOJIS, Permissions.FLAGS.ADD_REACTIONS, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.MANAGE_CHANNELS])){

            return interaction.reply(`<:xmark:1000738231886811156> *Cyro requires the following permissions to function!* <:xmark:1000738231886811156>\n\n- *Use External Emoji*\n- *Add Reactions*\n- *Manage Messages*\n- *Send Messages*\n- *View Channels*\n- *Manage Server*\n- *Manage Channels*`)

        } else {

        const command = client.commands.get(interaction.commandName)

        try {
           
            await command.execute(interaction, data, client, Discord, cmds)
        } catch (error) {
            console.error(error)
            await interaction.reply({ content: '<:xmark:1000738231886811156> *There was an error executing this command!* <:xmark:1000738231886811156>', ephemeral: true })
        }
    }
}
}
})


client.on(`guildMemberAdd`, async guildMember => {

    if(data.exists(`./data/guild/${guildMember.guild.id}.json`)){
        if(data.read(`./data/guild/${guildMember.guild.id}.json`, 'welcomeChannel')){

            var welcomeChannel = data.read(`./data/guild/${guildMember.guild.id}.json`, 'welcomeChannel')

            try {

                if(data.read(`./data/guild/${guildMember.guild.id}.json`, 'welcomeMessage')){

                    var message = data.read(`./data/guild/${guildMember.guild.id}.json`, 'welcomeMessage')
                    message = message.replace(/{servername}/g, guildMember.guild.name).replace(/{username}/g, guildMember.user.username).replace(/{userping}/g, guildMember.user).replace(/{servermembers}/g, guildMember.guild.memberCount)

                    client.channels.cache.get(welcomeChannel.toString()).send(message)

                    } else {
                    
                        client.channels.cache.get(welcomeChannel.toString()).send(`Welcome to the server, <@!${guildMember.id}>!`)

                }
                

            } catch (err) {

                return console.log(err)

            }

        }
    }

})

client.login(config.token)