import './MainView.css';
import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate, useParams} from 'react-router-dom';

import axios from 'axios';
import {
    Box, Button, Checkbox, Chip,
    FormControl,
    Input, InputLabel, ListItemText, MenuItem, Radio,
    RadioGroup, Select,
    Slider,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactComponent as TrashCanIcon} from './icons/trash-can-regular.svg';
import { ReactComponent as PlusIcon} from './icons/plus-solid.svg';
import { ReactComponent as SidebarIcon} from './icons/sidebar-regular.svg';

import generateAmazonLink from "./Amazon";

function MainView() {
    const {uuid} = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null); // {conversationUUID: '', data: [{promptInfo: {}, gifts: {}}]}
    const [errorMessage, setErrorMessage] = useState(null);
    const [conversation, setConversation] = useState({})
    const [showSidebar, setShowSidebar] = useState(true);

    // Form variables
    // const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [relationship, setRelationship] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 20]);
    const [occasion, setOccasion] = useState('');
    const [interests, setInterests] = useState([]);
    const [disinterests, setDisinterests] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [openEndedAddition, setOpenEndedAddition] = useState('');

    // Follow up variables
    const [thumbsUpCategories, setThumbsUpCategories] = useState([]);
    const [thumbsDownCategories, setThumbsDownCategories] = useState([]);

    const [isLoadingData, setIsLoading] = useState(false);

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
    }, []);

    const UUID = () => {
        // Random uppercase, lowercase, and numbers 32 characters long
        // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        let uuid = '';
        for(let i = 0; i < 32; i++) {
            uuid += Math.floor(Math.random() * 16).toString(16);
            if(i === 7 || i === 11 || i === 15 || i === 19) {
                uuid += '-';
            }
        }
        return uuid;
    }

    const saveConversation = (title,conversationUUID, data) => {
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
                title = existingConversations.filter((conversation) => conversation.uuid === conversationUUID)[0].title;
                conversation.title = title;
            }
            // Existing conversions that are not the current conversation
            const otherConversations = existingConversations.filter((conversation) => conversation.uuid !== conversationUUID);
            localStorage.setItem('conversations', JSON.stringify([
                ...otherConversations,
                conversation,
            ]));
            setConversation([
                ...otherConversations,
                conversation,
            ])
        }else{
            localStorage.setItem('conversations', JSON.stringify([conversation]));
            setConversation([conversation]);
        }
    }

    const deleteConversation = (conversationUUID) => {
        if(window.confirm('Are you sure you want to delete this conversation?')) {
            // Delete conversation from localstorage
            const existingConversations = JSON.parse(localStorage.getItem('conversations'));
            if (existingConversations) {
                const otherConversations = existingConversations.filter((conversation) => conversation.uuid !== conversationUUID);
                localStorage.setItem('conversations', JSON.stringify(otherConversations));
                setConversation(otherConversations);
                setData(null)
            }
        }
    }

    const toggleSidebarVisibility = () => {
        setShowSidebar(!showSidebar);
    }

    useEffect(() => {
        // Load previous conversations from localstorage
        const existingConversations = JSON.parse(localStorage.getItem('conversations'));
        if(existingConversations) {
            setConversation(existingConversations);
        }
        if(uuid){
            const existingConversations = JSON.parse(localStorage.getItem('conversations'));
            if(existingConversations) {
                const conversation = existingConversations.filter((conversation) => conversation.uuid === uuid)[0];
                if(conversation) {
                    setData(conversation);
                }else{
                    navigate('/')
                }
            }
        }
    }, []);

    const sendInitialMessage = () => {
        setIsLoading(true);
        const formData = {
            // name: name,
            age: age,
            gender: gender,
            relationship: relationship,
            // lowerBudgetRange: lowerBudgetRange,
            // upperBudgetRange: upperBudgetRange,
            upperBudgetRange: Math.max(budgetRange[0], budgetRange[1]),
            lowerBudgetRange: Math.min(budgetRange[0], budgetRange[1]),
            occasion: occasion,
            interests: interests,
            disinterests: disinterests,
            preferences: preferences,
            openEndedAddition: openEndedAddition,
        }
        console.log(formData)

        axios.post('http://localhost:3001/api/sendInitialMessage', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: formData
        })
            .then(function (response) {
                const newData = {conversationUUID: UUID(), data: [{promptInfo: formData, gifts: response.data.gifts}]}
                setData(newData);
                saveConversation(response.data.conversation_title, newData.conversationUUID, [{promptInfo: formData, gifts: response.data.gifts}]);
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage(error.message);
                console.log(error);
            })
            .finally(function () {
                // always executed
                setIsLoading(false);
            });
    }

    const sendFollowUpMessage = () => {
        setIsLoading(true);
        const followUpData = {
            thumbsUpCategories: thumbsUpCategories,
            thumbsDownCategories: thumbsDownCategories,
        }

        axios.post('http://localhost:3001/api/sendFollowUpMessage', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                previousPrompts: data.data,
                formData: followUpData,
            }
        })
            .then(function (response) {
                console.log('data: ', data);
                console.log('response: ', response);
                const newData = [
                    ...data.data, // Load all previous data
                    { // Add latest to the end
                        promptInfo: followUpData,
                        gifts: response.data.gifts,
                    }
                ];
                console.log("new data:", newData);
                setData({
                    conversationUUID: data.conversationUUID,
                    data: newData
                });
                saveConversation(response.data.conversation_title, data.conversationUUID, newData)
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage(error.message);
                console.log('error', error);
            })
            .finally(function () {
                // always executed
                setIsLoading(false);
                setThumbsUpCategories([]);
                setThumbsDownCategories([]);
                console.log('finally');
            });
    }

    const thumbsUpPressed = (keyword) => {
        if(thumbsUpCategories.includes(keyword)) {
            setThumbsUpCategories(thumbsUpCategories.filter((category) => category !== keyword));
        }else {
            setThumbsUpCategories([...thumbsUpCategories, keyword]);
        }
    }

    const thumbsDownPressed = (keyword) => {
        if(thumbsDownCategories.includes(keyword)) {
            setThumbsDownCategories(thumbsDownCategories.filter((category) => category !== keyword));
        }else {
            setThumbsDownCategories([...thumbsDownCategories, keyword]);
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
                <div className="App-sidebar">
                    <div className={'sidebar-header'}>
                        <div style={{width: '85%'}} className={'new-search'} onClick={()=>{
                            setData(null);
                            setThumbsUpCategories([]);
                            setThumbsDownCategories([]);
                            navigate('/')
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
                            }}>
                                <p>{item.title}</p>
                                <div style={{height: '100%', width: 20}} onClick={()=>{
                                    deleteConversation(item.uuid);
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
            )}
            <div className="App-header">
                {!data && (
                    <>
                        <ThemeProvider theme={darkTheme}>
                            <Box sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
                                <Typography variant="h4" gutterBottom>
                                    Who is this gift for?
                                </Typography>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Age"
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Gender</InputLabel>
                                    <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <MenuItem value="ignore">Ignore</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="transgender">Transgender</MenuItem>
                                        <MenuItem value="transMale">Trans Male</MenuItem>
                                        <MenuItem value="transFemale">Trans Female</MenuItem>
                                        <MenuItem value="genderqueer">Gender Fluid</MenuItem>
                                        <MenuItem value="nonBinary">Non-Binary</MenuItem>
                                        <MenuItem value="agender">Agender</MenuItem>
                                        <MenuItem value="bigender">Bigender</MenuItem>
                                        <MenuItem value="genderVariant">Gender Variant</MenuItem>
                                        <MenuItem value="twoSpirit">Two-Spirit</MenuItem>
                                        <MenuItem value="thirdGender">Third Gender</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Select value={relationship} onChange={(e) => setRelationship(e.target.value)}>
                                        <MenuItem value="mom">Mom</MenuItem>
                                        <MenuItem value="dad">Dad</MenuItem>
                                        <MenuItem value="brother">Brother</MenuItem>
                                        <MenuItem value="sister">Sister</MenuItem>
                                        <MenuItem value="son">Son</MenuItem>
                                        <MenuItem value="daughter">Daughter</MenuItem>
                                        <MenuItem value="wife">Wife</MenuItem>
                                        <MenuItem value="husband">Husband</MenuItem>
                                        <MenuItem value="girlfriend">Girlfriend</MenuItem>
                                        <MenuItem value="boyfriend">Boyfriend</MenuItem>
                                        <MenuItem value="grandmother">Grandmother</MenuItem>
                                        <MenuItem value="grandfather">Grandfather</MenuItem>
                                        <MenuItem value="greatgrandmother">Great-grandmother</MenuItem>
                                        <MenuItem value="greatgrandfather">Great-grandfather</MenuItem>
                                        <MenuItem value="aunt">Aunt</MenuItem>
                                        <MenuItem value="uncle">Uncle</MenuItem>
                                        <MenuItem value="niece">Niece</MenuItem>
                                        <MenuItem value="nephew">Nephew</MenuItem>
                                        <MenuItem value="cousin">Cousin</MenuItem>
                                        <MenuItem value="motherInLaw">Mother-in-law</MenuItem>
                                        <MenuItem value="fatherInLaw">Father-in-law</MenuItem>
                                        <MenuItem value="sisterInLaw">Sister-in-law</MenuItem>
                                        <MenuItem value="brotherInLaw">Brother-in-law</MenuItem>
                                        <MenuItem value="daughterInLaw">Daughter-in-law</MenuItem>
                                        <MenuItem value="sonInLaw">Son-in-law</MenuItem>
                                        <MenuItem value="stepMother">Step-mother</MenuItem>
                                        <MenuItem value="stepFather">Step-father</MenuItem>
                                        <MenuItem value="stepSister">Step-sister</MenuItem>
                                        <MenuItem value="stepBrother">Step-brother</MenuItem>
                                        <MenuItem value="stepSon">Step-son</MenuItem>
                                        <MenuItem value="stepDaughter">Step-daughter</MenuItem>
                                        <MenuItem value="godmother">Godmother</MenuItem>
                                        <MenuItem value="godfather">Godfather</MenuItem>
                                        <MenuItem value="goddaughter">Goddaughter</MenuItem>
                                        <MenuItem value="godson">Godson</MenuItem>
                                        <MenuItem value="fiancee">Fiancée</MenuItem>
                                        <MenuItem value="fiance">Fiancé</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Typography gutterBottom>Budget Range ${budgetRange[0]} - ${budgetRange[1]}</Typography>
                                    <Slider
                                        value={budgetRange}
                                        onChange={(e, newValue) => setBudgetRange(newValue)}
                                        valueLabelDisplay="auto"
                                        step={5}
                                        aria-label={`$${budgetRange[0]} - $${budgetRange[1]}`}
                                        valueLabelFormat={(value) => {
                                            return `$${value}`;
                                        }}
                                        max={100} // or whatever the max budget is
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <Select value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                                        <MenuItem value="birthday">Birthday</MenuItem>
                                        <MenuItem value="christmas">Christmas</MenuItem>
                                        <MenuItem value="anniversary">Anniversary</MenuItem>
                                        <MenuItem value="wedding">Wedding</MenuItem>
                                        <MenuItem value="engagement">Engagement</MenuItem>
                                        <MenuItem value="valentinesDay">Valentine's Day</MenuItem>
                                        <MenuItem value="mothersDay">Mother's Day</MenuItem>
                                        <MenuItem value="fathersDay">Father's Day</MenuItem>
                                        <MenuItem value="easter">Easter</MenuItem>
                                        <MenuItem value="hanukkah">Hanukkah</MenuItem>
                                        <MenuItem value="diwali">Diwali</MenuItem>
                                        <MenuItem value="ramadan">Ramadan/Eid</MenuItem>
                                        <MenuItem value="newYear">New Year</MenuItem>
                                        <MenuItem value="graduation">Graduation</MenuItem>
                                        <MenuItem value="babyShower">Baby Shower</MenuItem>
                                        <MenuItem value="bridalShower">Bridal Shower</MenuItem>
                                        <MenuItem value="housewarming">Housewarming</MenuItem>
                                        <MenuItem value="retirement">Retirement</MenuItem>
                                        <MenuItem value="promotion">Promotion/Career Achievement</MenuItem>
                                        <MenuItem value="thanksgiving">Thanksgiving</MenuItem>
                                        <MenuItem value="baptism">Baptism/Christening</MenuItem>
                                        <MenuItem value="barMitzvah">Bar Mitzvah</MenuItem>
                                        <MenuItem value="batMitzvah">Bat Mitzvah</MenuItem>
                                        <MenuItem value="confirmation">Confirmation</MenuItem>
                                        <MenuItem value="firstCommunion">First Communion</MenuItem>
                                        <MenuItem value="quinceanera">Quinceañera</MenuItem>
                                        <MenuItem value="sweetSixteen">Sweet Sixteen</MenuItem>
                                        <MenuItem value="friendshipDay">Friendship Day</MenuItem>
                                        <MenuItem value="sympathy">Sympathy/Condolence</MenuItem>
                                        <MenuItem value="getWellSoon">Get Well Soon</MenuItem>
                                        <MenuItem value="bonVoyage">Bon Voyage/Travel</MenuItem>
                                        <MenuItem value="newJob">New Job</MenuItem>
                                        <MenuItem value="passover">Passover</MenuItem>
                                        <MenuItem value="kwanzaa">Kwanzaa</MenuItem>
                                        <MenuItem value="halloween">Halloween</MenuItem>
                                        <MenuItem value="veteransDay">Veterans Day</MenuItem>
                                        <MenuItem value="independenceDay">Independence Day</MenuItem>
                                        <MenuItem value="stPatricksDay">St. Patrick's Day</MenuItem>
                                        <MenuItem value="teacherAppreciation">Teacher Appreciation</MenuItem>
                                        <MenuItem value="newBaby">New Baby Arrival</MenuItem>
                                        <MenuItem value="backToSchool">Back to School</MenuItem>
                                        <MenuItem value="earthDay">Earth Day</MenuItem>
                                        <MenuItem value="chineseNewYear">Chinese New Year</MenuItem>
                                        <MenuItem value="justBecause">Just Because</MenuItem>
                                        <MenuItem value="apology">Apology/Make Up</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Interests</InputLabel>
                                    <Select
                                        multiple
                                        value={interests}
                                        onChange={(e) => setInterests(e.target.value)}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {interestList.map((interest) => (
                                            <MenuItem key={interest} value={interest}>
                                                <Checkbox checked={interests.indexOf(interest) > -1} />
                                                <ListItemText primary={interest} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Disinterests</InputLabel>
                                    <Select
                                        multiple
                                        value={disinterests}
                                        onChange={(e) => setDisinterests(e.target.value)}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {interestList.map((disinterest) => (
                                            <MenuItem key={disinterest} value={disinterest}>
                                                <Checkbox checked={disinterests.indexOf(disinterest) > -1} />
                                                <ListItemText primary={disinterest} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Open Ended Addition"
                                        multiline
                                        rows={4}
                                        value={openEndedAddition}
                                        onChange={(e) => setOpenEndedAddition(e.target.value)}
                                    />
                                </FormControl>
                                <Button disabled={ isLoadingData ? isLoadingData : false } variant="contained" color="primary"  onClick={sendInitialMessage} style={{ marginTop: '20px' }}>
                                    Submit
                                </Button>
                            </Box>
                        </ThemeProvider>
                    </>
                )}
                {data && data.data && data.data.map((input, index) => {
                    return (
                        <>
                            <div key={`conversation ${index}`} style={{width: '100%'}}>
                                {index === 0 && (
                                    <p className={'input-bar'}>
                                        <span>I want a gift for a </span>
                                        {input.promptInfo.age ? <span>{input.promptInfo.age} year old</span> : <></>}
                                        {input.promptInfo.gender ? <span> {input.promptInfo.gender}</span> : <></>}
                                        {input.promptInfo.relationship ? <span> {input.promptInfo.relationship}</span> : <></>}
                                        {input.promptInfo.occasion ? <span> for {input.promptInfo.occasion}</span> : <></>}
                                        <span> with a budget of ${input.promptInfo.lowerBudgetRange} - ${input.promptInfo.upperBudgetRange}</span>
                                        {input.promptInfo.interests.length > 0 &&
                                            <p>This person is interested in {input.promptInfo.interests && input.promptInfo.interests.map((interest) => {
                                                return (
                                                    <span key={interest}>{interest}, </span>
                                                )
                                            })}
                                            </p>
                                        }
                                        {input.promptInfo.disinterests.length > 0 &&
                                            <p>And not interested in {input.promptInfo.disinterests && input.promptInfo.disinterests.map((interest) => {
                                                return (
                                                    <span key={interest}>{interest}, </span>
                                                )
                                            })}
                                            </p>
                                        }
                                        <p>{input.promptInfo.openEndedAddition ? <span> Also, {input.promptInfo.openEndedAddition}</span> : <></>}</p>
                                    </p>
                                )}
                                {index > 0 && (
                                    <p className={'input-bar'}>
                                        {input.promptInfo.thumbsUpCategories && input.promptInfo.thumbsUpCategories.length > 0 && (
                                            <span>
                                            <span>I want more gifts related to: </span>
                                                {input.promptInfo.thumbsUpCategories && input.promptInfo.thumbsUpCategories.map((category, index) => {
                                                    if (index === input.promptInfo.thumbsUpCategories.length - 1 && input.promptInfo.thumbsUpCategories.length > 1) {
                                                        return (
                                                            <span>and <span style={{color: '#dd0'}} key={category}>{category} </span></span>
                                                        )
                                                    }else if(input.promptInfo.thumbsUpCategories.length > 1){
                                                        return (
                                                            <span style={{color: '#dd0'}} key={category}>{category}, </span>
                                                        )
                                                    }else {
                                                        return (
                                                            <span style={{color: '#dd0'}} key={category}>{category} </span>
                                                        )
                                                    }
                                                })}
                                        </span>
                                        )}
                                        {input.promptInfo.thumbsDownCategories && input.promptInfo.thumbsDownCategories.length > 0 && (
                                            <span>
                                            <span>and less gifts related to: </span>
                                                {input.promptInfo.thumbsDownCategories && input.promptInfo.thumbsDownCategories.map((category) => {
                                                    if (index === input.promptInfo.thumbsDownCategories.length - 1 && input.promptInfo.thumbsDownCategories.length > 1) {
                                                        return (
                                                            <span>and <span style={{color: '#dd0'}} key={category}>{category} </span></span>
                                                        )
                                                    }else if(input.promptInfo.thumbsDownCategories.length > 1){
                                                        return (
                                                            <span style={{color: '#dd0'}} key={category}>{category}, </span>
                                                        )
                                                    }else {
                                                        return (
                                                            <span style={{color: '#dd0'}} key={category}>{category} </span>
                                                        )
                                                    }
                                                })}
                                        </span>
                                        )}
                                        {((!input.promptInfo.thumbsUpCategories || input.promptInfo.thumbsUpCategories.length === 0) && (!input.promptInfo.thumbsDownCategories || input.promptInfo.thumbsDownCategories.length === 0)) && (
                                            <p>Generate more gifts.</p>
                                        )}
                                    </p>
                                )}

                            </div>
                            <div className={'giftList'} key={index}>
                                {input.gifts.map((gift, index) => {
                                    return (
                                        <div key={index} className={'giftCard'}>
                                            <h1>{gift.name}</h1>
                                            <p className={'description'}>{gift.description}</p>
                                            <p className={'category'}>{gift.gift_topic}</p>
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

                                            {/* Removed due to inaccuracy in estimated price */}
                                            {/*<p className={'price'}>~ ${gift.price}</p>*/}
                                            <a className={'amazonLink'} target={'_blank'} href={generateAmazonLink(gift.name)}>Search on Amazon</a>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )})}
                {errorMessage && (
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                        {errorMessage}
                    </Typography>
                )}
                { isLoadingData && (
                    <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                        Loading...
                        Insert cool loading animation here
                    </Typography>
                )}
                {data && (
                    <>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={sendFollowUpMessage}
                            style={{ marginBottom: '120px' }}
                        >
                            Generate More!
                        </Button>

                        <div className={'feedback-bar'}>
                            {thumbsUpCategories.length > 0 && (
                                <div className={'reactionContainer'}>
                                    <span>👍: </span>
                                    {thumbsUpCategories.map((category, index) => {
                                        return (
                                            <div key={index} className={'reaction'}>
                                                <p>{category}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            {thumbsDownCategories.length > 0 && (
                                <div className={'reactionContainer'}>
                                    <span>👎: </span>
                                    {thumbsDownCategories.map((category, index) => {
                                        return (
                                            <div key={index} className={'reaction'}>
                                                <p>{category}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default MainView;
