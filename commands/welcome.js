const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Custommize Welcome Messages!')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription(`Choose a Welcome Channel`)
                .addChannelOption(option => option.setName('channel').setDescription('Select a Channel').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription(`Customize the Welcome Message!`) 
                .addStringOption(option => option.setName('message').setDescription(`{servername} {username} {userping} {servermembers}`).setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription(`Disable the Welcome Messages`) ),
	async execute(interaction, data, client, Discord, splashtext) {

        if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])){

            if(interaction.options.getSubcommand() === 'remove'){

                if(!data.exists(`./data/guild/${interaction.guild.id}.json`)){

                    return interaction.reply(`<:xmark:1000738231886811156> *You do not have a welcome message set!* <:xmark:1000738231886811156>`)

                } else {

                    data.delete(`./data/guild/${interaction.guild.id}.json`, 'welcomeChannel')
                    data.delete(`./data/guild/${interaction.guild.id}.json`, 'welcomeMessage')

                    return interaction.reply(`<:checkmark:1000737491621523488> *Successfully removed Welcome Messages* <:checkmark:1000737491621523488>`)

                }

            } else if (interaction.options.getSubcommand() === 'channel'){

                data.write(`./data/guild/${interaction.guild.id}.json`, 'welcomeChannel', interaction.options.getChannel(`channel`).id.toString())

                return interaction.reply(`<:checkmark:1000737491621523488> *Welcome channel set to ${interaction.options.getChannel(`channel`)}* <:checkmark:1000737491621523488>`)

            } else if (interaction.options.getSubcommand() === 'message'){

                data.write(`./data/guild/${interaction.guild.id}.json`, 'welcomeMessage', interaction.options.getString(`message`))

                var message = interaction.options.getString(`message`)

                message = message.replace(/{servername}/g, interaction.guild.name).replace(/{username}/g, interaction.user.username).replace(/{userping}/g, interaction.user).replace(/{servermembers}/g, interaction.guild.memberCount)

                return interaction.reply(`<:checkmark:1000737491621523488> *Welcome Message set!* <:checkmark:1000737491621523488>\n\n${message}`)

            }

        } else {

            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Channel!* <:xmark:1000738231886811156>\n\n*You are missing the following Permissions!*\n\n**- Manage Server**`)

        }

    }

}