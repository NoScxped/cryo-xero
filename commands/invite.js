const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite Cyro to your server!')
    .toJSON(),

    async execute(interaction, data, client, Discord, splashtext) {
       var embed = new MessageEmbed()
        .setAuthor({name: "Cyro Discord Bot"})
        .setDescription(`[*Join the Discord Server*](https://discord.gg/THZqsK3HTM)`)
        .addFields([
            {name: `__Utilities__`, value: `*Small utilities to make your Discord experience THAT much better!*`, inline: true}
        ])
        .setColor('RANDOM')
        const row = new MessageActionRow()
		.addComponents(
            new MessageButton()
				.setLabel(`Invite Cyro to your Server!`)
				.setStyle('LINK')
                .setURL("https://discord.com/api/oauth2/authorize?client_id=1007801785399906314&permissions=2147757168&scope=bot%20applications.commands"),
			new MessageButton()
				.setLabel(`Invite Solace to your Server!`)
				.setStyle('LINK')
                .setURL("https://discord.com/api/oauth2/authorize?client_id=756552050397020350&permissions=2147757120&scope=bot%20applications.commands")
            
                
		)
        
        await interaction.reply({components: [row], embeds: [embed]})
    }
}