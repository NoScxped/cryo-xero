const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('corner')
		.setDescription('Create and Manage your own corners!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('category')
                .setDescription(`Choose a category for corners to be created under!`)
                .addChannelOption(option => option.setName('category').setDescription('Choose a Category.').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('enabled')
                .setDescription(`Would you like to have corners in your server?`)
                .addBooleanOption(option => option.setName('enabled').setDescription('Enable Corners').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('create')
                .setDescription(`Create your own corner!`)
                .addStringOption(option => option.setName('name').setDescription('What is your corner name?')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rename')
                .setDescription(`Rename your corner!`)
                .addStringOption(option => option.setName('rename').setDescription('What is your corner name?').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('delete')
                .setDescription(`Delete your corner!`)),
	async execute(interaction, data, client, Discord, splashtext) {
        
        if(interaction.options.getSubcommand() === 'enabled'){

            if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])){

            data.write(`./data/guild/${interaction.guild.id}.json`, 'enableCorners', interaction.options.getBoolean(`enabled`).toString())
            return interaction.reply(`<:checkmark:1000737491621523488> *Corners have been set to **${interaction.options.getBoolean(`enabled`)}** *`)

            } else {

                return interaction.reply(`<:xmark:1000738231886811156> *Failed to change setting!* <:xmark:1000738231886811156>\n\n*You are missing the following Permissions!*\n\n**- Manage Server**`)

            }

        }

        if(interaction.options.getSubcommand() === 'category'){

            if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])){

            var categories = JSON.stringify(interaction.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY'))

            if(categories.includes(interaction.options.getChannel(`category`).id)){

                data.write(`./data/guild/${interaction.guild.id}.json`, 'cornerCategory', interaction.options.getChannel(`category`).id)
                return interaction.reply(`<:checkmark:1000737491621523488> *Corner category updated to **${interaction.options.getChannel(`category`).name}** * `)

            } else {

                return interaction.reply(`<:xmark:1000738231886811156> *That channel is not a Category!* <:xmark:1000738231886811156>`)
            }

            } else {

                return interaction.reply(`<:xmark:1000738231886811156> *Failed to change setting!* <:xmark:1000738231886811156>\n\n*You are missing the following Permissions!*\n\n**- Manage Server**`)

        }
        }

        if(interaction.options.getSubcommand() === 'rename'){

            var name = interaction.options.getString(`rename`)
            var corners = data.read(`./data/guild/${interaction.guild.id}.json`, 'corners')

            if(corners === undefined){return interaction.reply(`<:xmark:1000738231886811156> *You don't have a corner!* <:xmark:1000738231886811156>`)}

            if(!JSON.stringify(corners).includes(interaction.user.id)){return interaction.reply(`<:xmark:1000738231886811156> *You don't have a corner!* <:xmark:1000738231886811156>`)}

            if(data.exists(`./data/guild/${interaction.guild.id}.json`, 'cornerCategory') && data.read(`./data/guild/${interaction.guild.id}.json`, 'enableCorners') === 'true'){

                interaction.guild.channels.fetch(corners[`${interaction.user.id}`]).then(channel => {channel.setName(name)})
                return interaction.reply(`<:checkmark:1000737491621523488> *Corner Renamed!* <:checkmark:1000737491621523488>`)

            }

        }

        if(interaction.options.getSubcommand() === 'create'){

            if(data.read(`./data/guild/${interaction.guild.id}.json`, 'enableCorners') === 'true'){
        
                if(data.exists(`./data/guild/${interaction.guild.id}.json`, 'cornerCategory')){

                    if(data.read(`./data/guild/${interaction.guild.id}.json`, 'enableCorners') != 'true'){
                        return interaction.reply(`<:xmark:1000738231886811156> *Corners are not enabled on this server!* <:xmark:1000738231886811156>`)
                    }
        
                    var corners = data.read(`./data/guild/${interaction.guild.id}.json`, 'corners')

                    var name = interaction.user.username + `s-corner`

                    if(interaction.options.getString(`name`)){name = interaction.options.getString(`name`)}

                    var category =  data.read(`./data/guild/${interaction.guild.id}.json`, 'cornerCategory')

                    if(category === undefined){return interaction.reply(`<:xmark:1000738231886811156> *This Server does not have a Corner Category set!* <:xmark:1000738231886811156>`)}

                        if(corners === undefined){
        
                            try {

                            interaction.guild.channels.create(name).then(channel => { channel.setTopic(`Solace Corner for ${interaction.user.username}#${interaction.user.discriminator}`); channel.setParent(category); data.write(`./data/guild/${interaction.guild.id}.json`, 'corners', JSON.parse(`{"${interaction.user.id}": "${channel.id}"}`))})
                            interaction.reply(`<:checkmark:1000737491621523488> *Corner Created!* <:checkmark:1000737491621523488>`)
        
                    } catch {
        
                        return interaction.reply(`<:xmark:1000738231886811156> *Failed to create channel!* <:xmark:1000738231886811156>`)
        
                    }
        
                } else {

                    if(JSON.stringify(corners).includes(interaction.user.id)){return interaction.reply(`<:xmark:1000738231886811156> *You can only have **1** corner!* <:xmark:1000738231886811156>`)}
                    
                        interaction.guild.channels.create(name).then(channel => { 
                        
                            channel.setParent(category); 
                        
                            var obj = data.read(`./data/guild/${interaction.guild.id}.json`, `corners`)

                            obj[`${interaction.user.id}`] = channel.id

                            data.write(`./data/guild/${interaction.guild.id}.json`, 'corners', obj)
                    
                    })
                        

                        interaction.reply(`<:checkmark:1000737491621523488> *Corner Created!* <:checkmark:1000737491621523488>`)
        
                }
        
            } else {
        
                return interaction.reply(`<:xmark:1000738231886811156> *Corners are not enabled on this server!* <:xmark:1000738231886811156>`)
        
            }
        }
        }
        if(interaction.options.getSubcommand() === 'delete'){

            var corners = data.read(`./data/guild/${interaction.guild.id}.json`, 'corners')
            if(corners === undefined){return interaction.reply(`<:xmark:1000738231886811156> *You don't have a corner!* <:xmark:1000738231886811156>`)}
            if(!JSON.stringify(corners).includes(interaction.user.id)){return interaction.reply(`<:xmark:1000738231886811156> *You don't have a corner!* <:xmark:1000738231886811156>`)}

            try {

                interaction.guild.channels.delete(corners[`${interaction.user.id}`])
                delete corners[`${interaction.user.id}`]
                if(Object.keys(corners).length === 0){
                    data.delete(`./data/guild/${interaction.guild.id}.json`, 'corners')
                } else {
                    data.write(`./data/guild/${interaction.guild.id}.json`, 'corners', corners)
                }
                return interaction.reply(`<:checkmark:1000737491621523488> *Corner Deleted!* <:checkmark:1000737491621523488>`)

            } catch(err) {

                console.log(err)
                return interaction.reply(`<:xmark:1000738231886811156> *Failed to delete Corner!* <:xmark:1000738231886811156>`)

            }

        }
    }
}