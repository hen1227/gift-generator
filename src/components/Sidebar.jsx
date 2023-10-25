import React from "react";
import { ReactComponent as SidebarIcon} from '../icons/sidebar-regular.svg';
import { ReactComponent as PlusIcon} from '../icons/plus-solid.svg';
import { ReactComponent as TrashCanIcon} from '../icons/trash-can-regular.svg';
import {useNavigate} from "react-router-dom";
import {deleteConversation} from "../util/Converasations";


const Sidebar = ({ newChat, conversation, setData, toggleSidebarVisibility }) => {
    const navigate = useNavigate();

    return (
        <div className="sidebar">
            <div className={'sidebar-header'}>
                <div style={{width: '85%'}} className={'new-search'} onClick={()=>{
                    newChat();
                }}>
                    <PlusIcon width={20} fill={'#C9C9D5'}/>
                    <p style={{marginLeft: 10}}>New Search</p>
                </div>
                <div style={{width: '20%', aspectRatio: 1}} className={'new-search'} onClick={toggleSidebarVisibility}>
                    <SidebarIcon />
                </div>
            </div>
            {conversation && Object.values(conversation).map((item, index) => {
                console.log(item)
                return (
                    <div key={index} className={'conversation-item'} onClick={()=>{
                        setData({
                            conversationUUID: item.uuid,
                            data: conversation[index].data
                        })
                        navigate('/c/' + item.uuid)
                        window.location.reload();
                    }}>
                        <p>{item.title}</p>
                        <div style={{height: '100%', width: 20}} onClick={()=>{
                            deleteConversation(item.uuid, newChat);
                        }}>
                            <TrashCanIcon width={20} stroke={'#C9C9D5'}/>
                        </div>
                        {/*<p>{item.uuid}</p>*/}
                    </div>
                );
            })}
            {(!conversation || Object.keys(conversation).length === 0) && (
                <p>No past searches</p>
            )}
        </div>
    );
}

export default Sidebar;
