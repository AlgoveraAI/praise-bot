// Require the necessary discord.js classes
require('dotenv').config()
const { Client, Intents } = require('discord.js');
const {Client: NotionClient} =require("@notionhq/client");

const NOTION_KEY=process.env.NOTION_KEY;
const NOTION_DATABASE_ID=process.env.NOTION_PRAISE_DATABASE_ID;
const notion = new NotionClient({ auth: NOTION_KEY })
const { token } = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


async function addItem(giver, receiver, note, channel) {
	try {
		const response = await notion.pages.create({
		parent: { database_id: NOTION_DATABASE_ID },
		properties: {
			Giver: { 
				title:[
						{
					"text": {
						"content": giver
						}   
					}  
				]   
			},
			Receiver: { 
				rich_text:[
						{
					"text": {
						"content": receiver
						}   
					}  
				]   
			},
			Note: { 
				rich_text:[
						{
					"text": {
						"content": note
						}   
					}  
				]   
			},
			
			Channel: { 
				rich_text:[
						{
					"text": {
						"content": channel
						}   
					}  
				]   
			}
		},
		})
		console.log(response.id)
		console.log("Success! Entry added.")
		page_id = response.id;
	} catch (error) {
		console.error(error.body)
	};
}

async function updatePage (page_id, category) {
	await notion.pages.update({
		page_id: page_id,
		properties: {
			Category: { 
				rich_text:[
						{
					"text": {
						"content": category
						}   
					}  
				]   
			},
		},
	  });
	};

let page_id = "";

client.once('ready', (cient) => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
})

client.on('messageCreate', (message) => {
	const { MessageActionRow, MessageSelectMenu} = require('discord.js');
	const row = new MessageActionRow()
	.addComponents(
		new MessageSelectMenu()
			.setCustomId('select')
			.setPlaceholder('Select Praise Category')
			.addOptions([
				{
					label: 'Community',
					description: 'praise for engaging in the community',
					value: 'Community',
				},
				{
					label: 'Technical',
					description: 'technical contributions',
					value: 'Technical',
				},
				{
					label: 'Other',
					description: 'any other kind of praise!',
					value: 'Other',
				},
			]),
	);

	

	if (message.content.substring(0, 7) === '!praise') {
	const note_with_user = message.content.replace('!praise', '');
	const note = note_with_user.replace(/ *\<[^)]*\> */g, '');
	message.reply({content: `Thanks for praising ${message.mentions.users.first()}! Please select a category for the praise:`, components: [row]});
	addItem(message.author.username, message.mentions.users.first().username, note, message.channel.name);
	message.react('✅');
	
	}
}
);



client.on('interactionCreate', (interaction) => {
	{
        const { MessageEmbed } = require('discord.js');
        const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('You can see your praise here')
			.setURL('https://algovera.notion.site/95a4ca09cd89409ba56ec47dcddbd887?v=5aa1087c1c574c5e82b097c9ee90586c')
			.setDescription('Praise is logged in the public database above.');
        if (!interaction.isSelectMenu()) return;
            interaction.update({content: `Great! You've labeled the praise in the ${interaction.values} category!`, embeds: [embed], components: []});
			const category = interaction.values[0];
			updatePage(page_id, category) 
    }
})


client.login(token);