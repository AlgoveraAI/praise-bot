
module.exports = {
	name: 'messageCreate',
    once: false,
	async execute(message) {
        const NOTION_KEY=process.env.NOTION_KEY;
        const NOTION_DATABASE_ID=process.env.NOTION_DATABASE_ID;
        var {Client} =require("@notionhq/client");
        const notion = new Client({ auth: NOTION_KEY })
        async function addItem(message, giver, receiver, note, channel) {
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
                console.log(response)
                console.log("Success! Entry added.")
            } catch (error) {
                console.error(error.body)
            };
        }

        if (message.content.substring(0, 7) === '!praise') {
        const note_with_user = message.content.replace('!praise', '')
        const note = note_with_user.replace(/ *\<[^)]*\> */g, '')
        addItem(message, message.author.username, message.mentions.users.first().username, note, message.channel.name);
        message.react('✅');
	    }
    }
};