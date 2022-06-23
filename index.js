// Require the necessary discord.js classes
require('dotenv').config()
const { Client, Intents, Util } = require('discord.js');
const {Client: NotionClient} =require("@notionhq/client");
const admin = require("firebase-admin");

const NOTION_KEY=process.env.NOTION_KEY;
const NOTION_DATABASE_ID=process.env.NOTION_PRAISE_DATABASE_ID;
const notion = new NotionClient({ auth: NOTION_KEY })
const { token } = process.env.DISCORD_TOKEN;
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
  }); 

const db = admin.firestore();

async function addItem(giver, receiver, note, discord_channel) {
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
						"content": discord_channel
						}   
					}  
				]   
			}
		},
		})
		console.log(response.id)
		console.log("Success! Entry added.")
		console.log(note)
		page_id = response.id;
		from = giver;
		to = receiver;
		channel = discord_channel;
		text = note;
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
let from = "";
let to = "";
let text = "";
let category = "";
let channel = "";

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
	const note_with_channel = note_with_user.replace(/ *\<[^#]*\> */g, '');
	const clean_note = Util.cleanContent(note_with_channel, message.channel);
	message.reply({content: `Thanks for praising ${message.mentions.users.first()}! Please select a category for the praise:`, components: [row]});
	addItem(message.author.username, message.mentions.users.first().username, clean_note, message.channel.name);
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
			category = interaction.values[0];
			updatePage(page_id, category);
			db.collection('algovera').add({
				'from': from,
				'to': to,
				'text': text,
				'channel': channel,
				'category': category,
				'timestamp': Date()
			 });
    }
})


client.login(token);