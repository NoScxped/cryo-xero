const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('settings')
	.setDescription('Change Settings')
    .addSubcommand(subcommand =>
        subcommand
            .setName('counting')
            .setDescription('Set the Counting Channel')
            .addChannelOption(option => option.setName('channel').setDescription('Counting Channel').setRequired(true)))
    .toJSON(),

    async execute(interaction, data, client, Discord) {
        
        if(interaction.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) || interaction.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])){

       
        if(interaction.options.getSubcommand() === 'counting'){


                data.write(`./data/guild/${interaction.guild.id}.json`, 'countingChannel', interaction.options.getChannel('channel').id.toString())
                data.write(`./data/guild/${interaction.guild.id}.json`, 'countingNumber', `0`)
                data.delete(`./data/guild/${interaction.guild.id}.json`, 'lastCountingId')
                
                interaction.reply(`<:checkmark:1000737491621523488> *Counting Channel updated to ${interaction.options.getChannel('channel')}! The next number is **1**!* <:checkmark:1000737491621523488>`)

        }


        } else {
            return interaction.reply(`<:xmark:1000738231886811156> *You do not have permission to make this change!* <:xmark:1000738231886811156>`)
        }
    }
}