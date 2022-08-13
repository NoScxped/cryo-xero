const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel')
		.setDescription('Make Changes to this Channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('nsfw')
                .setDescription(`Toggle this channels NSFW Flag`)
                .addBooleanOption(option => option.setName('nsfw').setDescription('True/False').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('slowmode')
                .setDescription(`Set this Channel's SlowMode`)
                .addStringOption(option => option.setName('slowmode').setDescription(`This Channel's SlowMode`).setRequired(true).addChoices(
                    { name: 'Off', value: '0' },
                    { name: '5s', value: '5' },
                    { name: '10s', value: '10' },
                    { name: '15s', value: '15' },
                    { name: '30s', value: '30' },
                    { name: '1m', value: '60' },
                    { name: '2m', value: '120' },
                    { name: '5m', value: '300' },
                    { name: '10m', value: '600' },
                    { name: '15m', value: '900' },
                    { name: '30m', value: '1800' },
                    { name: '1h', value: '3600' },
                    { name: '2h', value: '7200' },
                    { name: '6h', value: '10800' },
                ))),
	async execute(interaction, data, client, Discord, splashtext) {

        if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])){

            if (interaction.options.getSubcommand() === 'nsfw'){

                try {

                    interaction.channel.setNSFW(interaction.options.getBoolean(`nsfw`))
                    return interaction.reply(`<:checkmark:1000737491621523488> *Channel NSFW Status updated!* <:checkmark:1000737491621523488>`)

                } catch {

                    return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Channel NSFW Status!* <:xmark:1000738231886811156>`)

                }
        
        
            } else if (interaction.options.getSubcommand() === 'slowmode'){

                try {

                    interaction.channel.setRateLimitPerUser(parseInt(interaction.options.getString(`slowmode`)))
                    return interaction.reply(`<:checkmark:1000737491621523488> *Channel Slowmode updated!* <:checkmark:1000737491621523488>`)

                } catch {

                    return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Channel Slowmode!* <:xmark:1000738231886811156>`)

                }
                
            }

        } else {

            return interaction.reply(`<:xmark:1000738231886811156> *Failed to update Channel!* <:xmark:1000738231886811156>\n\n*You are missing the following Permissions!*\n\n**- Manage Server**`)

        }

    }

}