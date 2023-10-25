

export const saveConversation = (title, conversationUUID, data, setConversations) => {
    // Save conversation to localstorage
    const conversation = {
        uuid: conversationUUID,
        title: title,
        data: data
    }

    // Check if conversation already exists
    const existingConversations = JSON.parse(localStorage.getItem('conversations'));

    if(existingConversations) {
        if(!title){
            console.log("No title provided, using existing title")
            const previousConversation = existingConversations.filter((conversation) => conversation.uuid === conversationUUID)[0];
            if(!previousConversation) {
                console.log("No previous conversation found, using default title")
                title = "Untitled Conversation";
            }else {
                title = previousConversation.title;
                conversation.title = title;
            }
        }
        // Existing conversions that are not the current conversation
        const otherConversations = existingConversations.filter((conversation) => conversation.uuid !== conversationUUID);
        console.log("Adding conversation: ", conversation);
        console.log("to: ", otherConversations);
        console.log("to get: ", [
            ...otherConversations,
            conversation,
        ]);

        localStorage.setItem('conversations', JSON.stringify([
            ...otherConversations,
            conversation,
        ]));
        setConversations([
            ...otherConversations,
            conversation,
        ])
    }else{
        localStorage.setItem('conversations', JSON.stringify([conversation]));
        setConversations([conversation]);
    }
}


export const deleteConversation = (conversationUUID, newChat) => {
    if(window.confirm('Are you sure you want to delete this conversation?')) {
        // Delete conversation from localstorage
        const existingConversations = JSON.parse(localStorage.getItem('conversations'));
        console.log(existingConversations);
        if (existingConversations) {
            const otherConversations = existingConversations.filter((conversation) => conversation.uuid !== conversationUUID);
            console.log(otherConversations);
            console.log(JSON.stringify(otherConversations));
            localStorage.setItem('conversations', JSON.stringify(otherConversations));
            newChat();
        }
    }
}
