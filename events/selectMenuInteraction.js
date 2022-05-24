module.exports = {
	name: 'interactionCreate',
    once: false,
	async execute(interaction) {
        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('You can see your praise here')
			.setURL('https://algovera.notion.site/95a4ca09cd89409ba56ec47dcddbd887?v=5aa1087c1c574c5e82b097c9ee90586c')
			.setDescription('Praise is logged in the public database above.');
        const { Client } = require('@notionhq/client');
        const notion = new Client({ auth: process.env.NOTION_KEY }); 
        const NOTION_DATABASE_ID=process.env.NOTION_PRAISE_DATABASE_ID;
        if (!interaction.isSelectMenu()) return;
            if (interaction.customId === 'select') {
                await interaction.update({content: `Great! You've labeled the praise in the ${interaction.values} category!`, embeds: [embed], components: []})
            }
    }
}