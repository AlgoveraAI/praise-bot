
module.exports = {
	name: 'messageCreate',
    once: false,
	async execute(message) {
        const { MessageActionRow, MessageSelectMenu} = require('discord.js');
        const NOTION_KEY=process.env.NOTION_KEY;
        const NOTION_DATABASE_ID=process.env.NOTION_PRAISE_DATABASE_ID;
        var {Client} =require("@notionhq/client");
        const notion = new Client({ auth: NOTION_KEY })
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
                return response.id;
            } catch (error) {
                console.error(error.body)
            };
        }

        if (message.content.substring(0, 7) === '!praise') {
        const note_with_user = message.content.replace('!praise', '');
        const note = note_with_user.replace(/ *\<[^)]*\> */g, '');
        message.reply({content: `Thanks for praising ${message.mentions.users.first()}! Please select a category for the praise:`, components: [row]});
        addItem(message.author.username, message.mentions.users.first().username, note, message.channel.name);
        message.react('✅');
	    }

    }
};