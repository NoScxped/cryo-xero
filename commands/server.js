const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const info = JSON.parse(fs.readFileSync(`./package-lock.json`))
module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('View Server Statistics')
        .addSubcommand(subcommand =>
            subcommand
                .setName('name')
                .setDescription(`Change your Server's name!`)
                .addStringOption(option => option.setName('name').setDescription('Server Name').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('notifications')
                .setDescription(`Change Default Notification Settings`)
                .addStringOption(option => option.setName('type').setDescription('Notification Type').setRequired(true).addChoices(
                    { name: 'All Messages', value: '0' },
                    { name: 'Only Mentions', value: '1' },
                ))
                )
        .addSubcommand(subcommand =>
            subcommand
                .setName('boostprogressbar')
                .setDescription(`Show Boost Progress Bar`)
                .addBooleanOption(option => option.setName('progress').setDescription('Show Boost Progress Bar').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('verification')
                .setDescription(`Verification Level`)
                .addStringOption(option => option.setName('verification').setDescription('Verification Level').setRequired(true).addChoices(
                    { name: 'None', value: '0' },
                    { name: 'Low', value: '1' },
                    { name: 'Medium', value: '2' },
                    { name: 'High', value: '3' },
                    { name: 'Highest', value: '4' },
                )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('contentfilter')
                .setDescription(`Content Filter`)
                .addStringOption(option => option.setName('filter').setDescription('Content Filter').setRequired(true).addChoices(
                            { name: 'Disabled', value: '0' },
                            { name: 'Scan Members Without Roles', value: '1' },
                            { name: 'Scan All Members', value: '2' }
                )))
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription(`View server statistics!`)),
	async execute(interaction, data, client, Discord, splashtext) {

        
        if(interaction.options.getSubcommand() === 'info'){

            const sent = await interaction.reply({ content: '<a:typing:1000730579542736927> *Cyro is thinking* <a:typing:1000730579542736927>', fetchReply: true});

            var embed = new MessageEmbed()
                .setTitle("*" + interaction.guild.name + "*")
                .addFields([
                    {name: '__Member Count__', value: interaction.guild.memberCount.toString()},
                    {name: '__Creation Date__', value: interaction.guild.createdAt.toString()}
                ])
                .setDescription(`*Owned by <@!${interaction.guild.ownerId}>*`)
                .setColor(`9400D3`)
                .setThumbnail(interaction.guild.iconURL())

            await sent.edit({content: "_ _",embeds: [embed]})

        } else {
            
            if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])){ 

                if (interaction.options.getSubcommand() === 'name'){
        
                        try {
        
                            interaction.guild.edit({
                                name: interaction.options.getString(`name`),
                            })
        
                                return interaction.reply(`<:checkmark:1000737491621523488> *Server Name updated successfully!* <:checkmark:1000737491621523488>`)
        
                        } catch {
        
                            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Name!* <:xmark:1000738231886811156>`)
        
                        }

                } else if (interaction.options.getSubcommand() === 'notifications'){
        
                        try {
        
                            interaction.guild.setDefaultMessageNotifications(parseInt(interaction.options.getString(`type`)))
        
                                return interaction.reply(`<:checkmark:1000737491621523488> *Server Notification Settings updated successfully!* <:checkmark:1000737491621523488>`)
        
                        } catch {
        
                            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Settings!* <:xmark:1000738231886811156>`)
        
                        }
        
                } else if (interaction.options.getSubcommand() === 'boostprogressbar') {
        
                        try {
        
                            interaction.guild.setPremiumProgressBarEnabled(interaction.options.getBoolean(`progress`))
        
                                return interaction.reply(`<:checkmark:1000737491621523488> ***Show Server Boost Progress Bar** is set to **${interaction.options.getBoolean(`progress`).toString()}**!* <:checkmark:1000737491621523488>`)
        
                        } catch {
        
                            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Settings!* <:xmark:1000738231886811156>`)
        
                        }

                } else if (interaction.options.getSubcommand() === 'verification'){
   
                        try {
        
                            interaction.guild.setVerificationLevel(parseInt(interaction.options.getString(`verification`)))
        
                                return interaction.reply(`<:checkmark:1000737491621523488> *Verification Level Updated!* <:checkmark:1000737491621523488>`)
        
                        } catch {
        
                            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Settings!* <:xmark:1000738231886811156>`)
        
                        }
        
                } else if (interaction.options.getSubcommand() === 'contentfilter'){
        
                        try {
        
                            interaction.guild.setExplicitContentFilter(parseInt(interaction.options.getString(`filter`)))
        
                                return interaction.reply(`<:checkmark:1000737491621523488> *Content Filter Updated!* <:checkmark:1000737491621523488>`)
        
                        } catch {
        
                            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Settings!* <:xmark:1000738231886811156>`)
        
                        }
        
                }

            } else {
        
                return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Server Name!* <:xmark:1000738231886811156>\n\n*You are missing the following Permissions!*\n\n**- Manage Server**`)
            
            }
        } 
    }
}