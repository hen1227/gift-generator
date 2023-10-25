import React from "react";
import { ReactComponent as TrashCanIcon} from '../icons/trash-can-regular.svg';
import { ReactComponent as BookmarkIcon} from '../icons/gift-svgrepo-com.svg';
import { ReactComponent as SearchIcon} from '../icons/magnifying-glass-solid.svg';
import {useNavigate} from "react-router-dom";
import {deleteBookmark, getBookmarks} from "../util/Bookmarks";
import generateAmazonLink from "../Amazon";

const BookmarkSidebar = ({ bookmarks, setBookmarks, toggleBookmarkVisibility }) => {
    const navigate = useNavigate();

    return (
        <div className="bookmark-sidebar">
            <div className={'bookmark-sidebar-header'}>
                <div style={{width: '20%', aspectRatio: 1}} className={'new-search'} onClick={toggleBookmarkVisibility}>
                    <BookmarkIcon color={"#fff"} width={39}/>
                </div>
                    <span style={{width: "65%"}}> Bookmarks</span>
            </div>
            {bookmarks && Object.values(bookmarks).map((item, index) => {
                console.log(item)
                return (
                    <>
                        <div key={index} className={'conversation-item'}>
                            <div onClick={() => {
                                window.open(generateAmazonLink(item.gift.name), '_blank');
                            }}>
                            <SearchIcon width={20} style={{position: 'absolute', left: 8, top:0, height: '100%'}} stroke={'#C9C9D5'}/>
                            </div>
                            <div style={{marginLeft:12}} onClick={() => {
                                navigate('/c/' + item.uuid);
                                // reload page at new conversation
                                window.location.reload();
                            }}>
                                <p>{item.gift.name}</p>
                            </div>
                            {/*<p>{item.uuid}</p>*/}
                            <div style={{height: '100%', width: 20}} onClick={()=>{
                                deleteBookmark(item.gift, item.uuid);
                                setBookmarks(getBookmarks());

                            }}>
                                <TrashCanIcon width={20} stroke={'#C9C9D5'}/>
                            </div>
                        </div>

                    </>
                );
            })}
            {(!bookmarks || Object.keys(bookmarks).length === 0) && (
                <p>No gifts have been bookmarked</p>
            )}
        </div>
    );
}

export default BookmarkSidebar;
