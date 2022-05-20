module.exports = {
	name: 'interactionCreate',
    once: false,
	async execute(interaction) {
        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('You can see your praise here')
			.setURL('https://algovera.notion.site/4ea600f2320e4ea2a564ae78c506c97d?v=824fb5c693c94f6a8a24dd29431aaa43')
			.setDescription('Praise is logged in the public database above.');
        const { Client } = require('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_KEY }); 
        const NOTION_DATABASE_ID=process.env.NOTION_DATABASE_ID;
        if (!interaction.isSelectMenu()) return;
            if (interaction.customId === 'select') {
                await interaction.update({content: `Great! You've labeld the praise in the ${interaction.values} category!`, embeds: [embed], components: []})
            }
    }
}