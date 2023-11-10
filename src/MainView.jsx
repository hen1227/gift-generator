import './MainView.css';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from 'react-router-dom';
import {
    Button,
    Typography
} from "@mui/material";
import { createTheme } from '@mui/material/styles';
import { ReactComponent as SidebarIcon} from './icons/sidebar-regular.svg';
// import { ReactComponent as BookmarkIcon} from './icons/gifts-solid.svg';
import { ReactComponent as BookmarkIcon} from './icons/gift-svgrepo-com.svg';
import InitialForm from "./components/InitialForm";
import FeedbackBar from "./components/FeedbackBar";
import GiftList from "./components/GiftList";
import InputBar from "./components/InputBar";
import Sidebar from "./components/Sidebar";
import {sendFollowUpMessage, sendInitialMessage} from "./util/APIs";
import BookmarkSidebar from "./components/BookmarkSidebar";
import {getBookmarks} from "./util/Bookmarks";
import {toast} from "react-toastify";


function MainView({isLoading, setIsLoading}) {
    const {uuid} = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null); // {conversationUUID: '', data: [{promptInfo: {}, gifts: {}}]}
    const [errorMessage, setErrorMessage] = useState(null);
    const [conversation, setConversation] = useState({})
    const [bookmarks, setBookmarks] = useState([]);
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const [showBookmarks, setShowBookmarks] = useState(window.innerWidth > 800)

    // Form variables
    // const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [relationship, setRelationship] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 3]);
    const [occasion, setOccasion] = useState('');
    const [interests, setInterests] = useState([]);
    const [disinterests, setDisinterests] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [openEndedAddition, setOpenEndedAddition] = useState('');

    // Follow up variables
    const [thumbsUpCategories, setThumbsUpCategories] = useState([]);
    const [thumbsDownCategories, setThumbsDownCategories] = useState([]);

    const [interestList, setInterestList] = useState([]);

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    useEffect(() => {
        // fetch from public folder
        fetch('/interests.txt').then((r) => r.text()).then(text  => {
            setInterestList(text.split('\n'));
        });

        // Load previous conversations from localstorage
        const existingConversations = JSON.parse(localStorage.getItem('conversations'));
        if(existingConversations) {
            setConversation(existingConversations);
        }

        // If specific UUID is requested, load that conversation
        if(uuid){
            const existingConversations = JSON.parse(localStorage.getItem('conversations'));
            if(existingConversations) {
                const conversation = existingConversations.filter((conversation) => conversation.uuid === uuid)[0];
                if(conversation) {
                    setData(conversation);
                }else{
                    navigate('/')
                    toast.error('Conversation with UUID \'' + uuid + '\' not found.');
                }
            }
        }

        // Load bookmarks
        const existingBookmarks = getBookmarks();
        if(existingBookmarks) {
            setBookmarks(existingBookmarks);
        }
    }, []);

    const initialSubmit = () => {
        const formData = {
            age: age,
            gender: gender,
            relationship: relationship,
            upperBudgetRange: budgetScale(Math.max(budgetRange[0], budgetRange[1])),
            lowerBudgetRange: budgetScale(Math.min(budgetRange[0], budgetRange[1])),
            occasion: occasion,
            interests: interests,
            disinterests: disinterests,
            preferences: preferences,
            openEndedAddition: openEndedAddition,
        }
        sendInitialMessage(formData, setIsLoading, setData, setErrorMessage, setConversation, navigate);
    }

    const followUpSubmit = () => {
        sendFollowUpMessage(setIsLoading, thumbsUpCategories, thumbsDownCategories, setData, data, setErrorMessage, clearChat, setConversation)
    }

    const expandUponSubmit = () => {
        // sendExpandUponMessage(setIsLoading, thumbsUpCategories, thumbsDownCategories, setData, data, setErrorMessage, clearChat, setConversation)
    }

    const toggleSidebarVisibility = () => {
        setShowSidebar(!showSidebar);
    }

    const toggleBookmarkVisibility = () => {
        setShowBookmarks(!showBookmarks);
    }

    const clearChat = () => {
        setAge('');
        setGender('');
        setRelationship('');
        setBudgetRange([0, 20]);
        setOccasion('');
        setInterests([]);
        setDisinterests([]);
        setPreferences([]);
        setOpenEndedAddition('');

        setThumbsUpCategories([]);
        setThumbsDownCategories([]);
    }

    const newChat = () => {
        clearChat();
        setData(null);
        navigate('/');
        window.location.reload();
    }

    function budgetScale(x) {
        // From 0-10, scale to 0-100
        // From 10-20, scale to 100-1000
        if(x <= 10) {
            return x * 10;
        }else {
            return (x - 10) * 100 + 100;
        }
    }

    return (
        <div className="App">
            {!showSidebar && (
                <div className={'new-search'} style={{backgroundColor: '#3e3f4d', width: 39, height: 39, position: 'absolute', top: 0, left: 0, zIndex: 10}} onClick={toggleSidebarVisibility}>
                    <SidebarIcon />
                </div>
            )}
            {showSidebar && (
                <Sidebar
                    newChat={newChat}
                    conversation={conversation}
                    setData={setData}
                    toggleSidebarVisibility={toggleSidebarVisibility}
                />
            )}
            <div style={showSidebar ? {} : {width: '100svw'}} className="App-header">
                {!data && (
                   <InitialForm
                        theme={darkTheme}
                        age={age}
                        setAge={setAge}
                        gender={gender}
                        setGender={setGender}
                        relationship={relationship}
                        setRelationship={setRelationship}
                        budgetRange={budgetRange}
                        setBudgetRange={setBudgetRange}
                        occasion={occasion}
                        setOccasion={setOccasion}
                        interests={interests}
                        setInterests={setInterests}
                        disinterests={disinterests}
                        setDisinterests={setDisinterests}
                        preferences={preferences}
                        setPreferences={setPreferences}
                        openEndedAddition={openEndedAddition}
                        setOpenEndedAddition={setOpenEndedAddition}
                        interestList={interestList}
                        isLoadingData={isLoading}
                        initialSubmit={initialSubmit}
                        budgetScale={budgetScale}
                   />
                )}
                {data && data.data && data.data.map((input, index) => {
                    return (
                        <>
                            <InputBar input={input} index={index}/>
                            <GiftList
                                input={input}
                                index={index}
                                thumbsUpCategories={thumbsUpCategories}
                                setThumbsUpCategories={setThumbsUpCategories}
                                thumbsDownCategories={thumbsDownCategories}
                                setThumbsDownCategories={setThumbsDownCategories}
                                bookmarks={bookmarks}
                                setBookmarks={setBookmarks}
                                conversationUUID={uuid}
                            />
                        </>
                    )})}
                {errorMessage && (
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                        {errorMessage}
                    </Typography>
                )}
                {data && (
                    <>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={followUpSubmit}
                            disabled={isLoading}
                            style={{ marginBottom: '120px' }}
                        >
                            Generate More!
                        </Button>

                        <FeedbackBar thumbsUpCategories={thumbsUpCategories} thumbsDownCategories={thumbsDownCategories} />
                    </>
                )}
            </div>
            {!showBookmarks && (
                <div className={'new-search'} style={{backgroundColor: '#3e3f4d', width: 39, height: 39, position: 'absolute', top: 0, right: 0, zIndex: 10}} onClick={toggleBookmarkVisibility}>
                    <BookmarkIcon />
                </div>
            )}
            {showBookmarks && (
                <BookmarkSidebar
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                    toggleBookmarkVisibility={toggleBookmarkVisibility}
                />
            )}
        </div>
    );
}

export default MainView;
