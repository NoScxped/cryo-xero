const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('poll')
	.setDescription('Run a poll!')
	.addStringOption(option => option.setName('title').setDescription('Enter a title:').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('Enter poll description:').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('Select a Channel'))
    .addMentionableOption(option => option.setName('ping').setDescription('Add a Ping'))
    .toJSON(),

    async execute(interaction, data, client, Discord) {

        var embed = new MessageEmbed()
        .setTitle(interaction.options.getString('title'))
        .setColor("a6dced")
        .setDescription("*" + interaction.options.getString('description') + "*")
        .setAuthor({ name: 'Created by ' + interaction.user.username, iconURL: interaction.user.avatarURL(), url: interaction.user.avatarURL() })

        var channel = interaction.channel

        if (interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])){
            if(interaction.options.getChannel(`channel`)){
            channel = interaction.options.getChannel(`channel`)
            if(interaction.options.getMentionable(`ping`)){
                    client.channels.cache.get(channel.id.toString()).send({content: interaction.options.getMentionable(`ping`).toString()})
                }
        }
        }
        
        

            try {

                if (!interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && !interaction.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])){
                    if(interaction.options.getChannel(`channel`) || interaction.options.getMentionable(`ping`)){
                        return interaction.reply({content: `You do not have either of the following permissions: **Admin** *or* **Manage Channels**\n\n*You cannot set a Channel or a Mention without these permissions!*`, ephemeral: true})
                    }
                    
                }
                
                const sent = client.channels.cache.get(channel.id.toString()).send({embeds: [embed]})
            .then(function (message) {

                message.react("<:checkmark:1000737491621523488>")
                message.react("<:xmark:1000738231886811156>")

                interaction.reply({content: "Poll Created!", ephemeral: true})
    
            })
            } catch{
                interaction.reply({content: `<:xmark:994105062353817682> *Failed to send poll! Either this channel has been deleted **or** Xero doesnt not have the permissions to message it.* <:xmark:994105062353817682>`, ephemeral: true})
        }
    }
}