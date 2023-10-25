import generateAmazonLink from "../Amazon";
import React from "react";
import {deleteBookmark, getBookmarks, saveBookmark} from "../util/Bookmarks";
import { ReactComponent as BookmarkIcon} from '../icons/bookmark-solid.svg';
import { ReactComponent as UnBookmarkIcon} from '../icons/bookmark-regular.svg';
import { ReactComponent as ExpandUponIcon} from '../icons/magnifying-glass-plus-solid.svg';


const GiftList = ({ input, index, thumbsUpCategories, setThumbsUpCategories, thumbsDownCategories, setThumbsDownCategories, bookmarks, setBookmarks, conversationUUID}) => {

    const thumbsUpPressed = (keyword) => {
        if(thumbsUpCategories.includes(keyword)) {
            setThumbsUpCategories(thumbsUpCategories.filter((category) => category !== keyword));
        }else {
            // Remove keyword from thumbsDownCategories
            setThumbsDownCategories(thumbsDownCategories.filter((category) => category !== keyword));

            // Add keyword to thumbsUpCategories
            setThumbsUpCategories([...thumbsUpCategories, keyword]);
        }
    }

    const thumbsDownPressed = (keyword) => {
        if(thumbsDownCategories.includes(keyword)) {
            setThumbsDownCategories(thumbsDownCategories.filter((category) => category !== keyword));
        }else {
            // Remove keyword from thumbsUpCategories
            setThumbsUpCategories(thumbsUpCategories.filter((category) => category !== keyword));

            // Add keyword to thumbsDownCategories
            setThumbsDownCategories([...thumbsDownCategories, keyword]);
        }
    }

    const saveBookmarkSubmit = (gift, conversationUUID) => {
        saveBookmark(gift, conversationUUID);
        setBookmarks(getBookmarks());
    }

    const isBookmarked = (gift, bookmarks) => {
        let isBookmarked = false;

        // Check if gift is in bookmarks
        bookmarks.forEach((bookmark) => {
            if(bookmark.gift.name === gift.name && bookmark.uuid === conversationUUID) {
                isBookmarked = true;
            }
        });

        return isBookmarked;
    }

    return (
        <div className={'giftList'} key={index}>
            {input.gifts.map((gift, index) => {
                return (
                    <div key={index} className={'giftCard'}>
                        <h1>{gift.name}</h1>
                        {/*<p className={'description'}>{gift.description}</p>*/}
                        {/*<p className={'category'}>{gift.gift_topic}</p>*/}
                        <div className={'keywords'}>
                            {gift.keywords.split(',').map((keyword, index) => {
                                return (
                                    <div>
                                        <button className={'thumbsDown'} onClick={()=>{
                                            thumbsDownPressed(keyword);
                                        }}>👎</button>
                                        <span key={index}>{keyword}</span>
                                        <button className={'thumbsUp'} onClick={()=>{
                                            thumbsUpPressed(keyword);
                                        }}>👍</button>
                                    </div>
                                )
                            })}
                        </div>
                        <button className={'bookmarkButton'} onClick={() => {
                            if (isBookmarked(gift, bookmarks)) {
                                deleteBookmark(gift, conversationUUID);
                                setBookmarks(getBookmarks());
                            } else {
                                saveBookmarkSubmit(gift, conversationUUID);
                            }
                        }}>
                            { isBookmarked(gift, bookmarks) ? (
                                <BookmarkIcon width={15} height={22} color={'#fff'} />
                            ) : (
                                <UnBookmarkIcon width={15} height={22} color={'#fff'} />
                            )}
                        </button>

                        {/*<button className={'bookmarkButton'} style={{left:'unset', right:0}} onClick={() => {*/}
                        {/*    if (isBookmarked(gift, bookmarks)) {*/}
                        {/*        deleteBookmark(gift, conversationUUID);*/}
                        {/*        setBookmarks(getBookmarks());*/}
                        {/*    } else {*/}
                        {/*        saveBookmarkSubmit(gift, conversationUUID);*/}
                        {/*    }*/}
                        {/*}}>*/}
                        {/*    <ExpandUponIcon width={15} height={22} color={'#fff'} />*/}
                        {/*</button>*/}


                        {/* Removed due to inaccuracy in estimated price */}
                        {/*<p className={'price'}>~ ${gift.price}</p>*/}
                        <a className={'amazonLink'} rel="noreferrer" target={'_blank'} href={generateAmazonLink(gift.name)}>Search on Amazon</a>
                    </div>
                )
            })}
        </div>
    );
}

export default GiftList;
