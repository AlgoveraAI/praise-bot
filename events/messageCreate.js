
module.exports = {
	name: 'messageCreate',
    once: false,
	async execute(message) {
        const NOTION_KEY=process.env.NOTION_KEY;
        const NOTION_DATABASE_ID=process.env.NOTION_DATABASE_ID;
        var {Client} =require("@notionhq/client");
        const notion = new Client({ auth: NOTION_KEY })
        async function addItem(giver, receiver, note) {
            const note_with_user = message.content.replace('!praise', '')
            note = note_with_user.replace(/ *\<[^)]*\> */g, '')
            giver = message.author.username
            receiver = message.mentions.users.first().username;
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
                    }
                },
                })
                console.log(response)
                console.log("Success! Entry added.")
            } catch (error) {
                console.error(error.body)
            }
        }

        if (message.content.substring(0, 7) === '!praise') {
        addItem(message.author, message.mentions.users.first().username, message.content.replace('!praise', ''))

	    }
    }
};