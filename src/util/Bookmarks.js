
export const saveBookmark = (gift, conversationUUID) => {
    console.log("saving bookmark with uuid:", conversationUUID)

    const bookmark = {
        gift: gift,
        uuid: conversationUUID
    }

    const previousBookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    if (previousBookmarks) {
        const newBookmarks = [...previousBookmarks.filter(prevBookmark => prevBookmark.gift.gift_topic !== gift.gift_topic || prevBookmark.gift.name !== gift.name || prevBookmark.gift.keywords !== gift.keywords || prevBookmark.uuid !== conversationUUID), bookmark];

        console.log("new bookmarks:", newBookmarks)
        console.log("adding bookmark:", bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    } else {
        localStorage.setItem('bookmarks', JSON.stringify([bookmark]));
    }
}

export const getBookmarks = () => {
    return JSON.parse(localStorage.getItem('bookmarks'));
}

export const deleteBookmark = (gift, conversationUUID) => {
    console.log("deleting bookmark:", gift, conversationUUID)

    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const newBookmarks = bookmarks.filter(prevBookmark => prevBookmark.gift.gift_topic !== gift.gift_topic || prevBookmark.gift.name !== gift.name || prevBookmark.gift.keywords !== gift.keywords || prevBookmark.uuid !== conversationUUID);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
}
