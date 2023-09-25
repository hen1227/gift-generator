import './App.css';
import React, {useEffect, useState} from "react";
import axios from 'axios';
import {
    Box, Button, Chip,
    FormControl,
    FormControlLabel, FormLabel,
    Grid,
    Input, InputLabel, MenuItem, Radio,
    RadioGroup, Select,
    Slider,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

import generateAmazonLink from "./Amazon";

function App() {
    const [data, setData] = useState(null); // [{promptInfo: {}, gifts: {}}}]
    const [errorMessage, setErrorMessage] = useState(null);

    const [followUps, setFollowUps] = useState(null);

    // Form variables
    // const [name, setName] = useState('');
    const [age, setAge] = useState(null);
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
        fetch('interests.txt').then((r) => r.text()).then(text  => {
            setInterestList(text.split('\n'));
            // console.log(text.split());
        });
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
            upperBudgetRange: Math.min(budgetRange[0], budgetRange[1]),
            lowerBudgetRange: Math.max(budgetRange[0], budgetRange[1]),
            occasion: occasion,
            interests: interests,
            disinterests: disinterests,
            preferences: preferences,
            openEndedAddition: openEndedAddition
        }
        console.log(formData)

        axios.post('http://localhost:3001/api/sendInitialMessage', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: formData
        })
            .then(function (response) {
                console.log(response);
                console.log(response.data)
                setData([{promptInfo: formData, gifts: response.data}]);
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
                previousPrompts: data,
                formData: followUpData,
            }
        })
            .then(function (response) {
                console.log(response);
                console.log(response.data)
                setData(
                    [
                        ...data, // Load all previous data
                        { // Add latest to the end
                            promptInfo: followUpData,
                            gifts: response.data
                        }
                    ]
                );
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage(error.message);
                console.log(error);
            })
            .finally(function () {
                // always executed
                setIsLoading(false);
                setThumbsUpCategories([]);
                setThumbsDownCategories([]);
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
            <header className="App-header">
                {!data && (
                    <>
                    <p>Who is the gift for?</p>
                    <div style={{ padding: '20px', maxWidth: '40vw'  }}>
                        <TextField
                            label="Age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            fullWidth
                        />
                        <FormControl component="fieldset" style={{ marginTop: '20px' }}>
                            <FormLabel component="legend">Gender</FormLabel>
                            <RadioGroup value={gender} onChange={(e) => setGender(e.target.value)}>
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                {/* TODO: add textbox to enter custom */}
                                <FormControlLabel value="" control={<Radio />} label="Exclude from prompt" />
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            label="Relationship"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                            fullWidth
                            style={{ marginTop: '20px' }}
                        />
                        <div style={{ marginTop: '20px' }}>
                            <p>Budget Range: ${budgetRange[0]} - ${budgetRange[1]}</p>
                            <Slider
                                value={budgetRange}
                                onChange={(e, newValue) => setBudgetRange(newValue)}
                                valueLabelDisplay="auto"
                                step={5}
                                aria-valuetext={`$${budgetRange[0]} - $${budgetRange[1]}`}
                                valueLabelFormat={(value) => {
                                    return `$${value}`;
                                }}
                                max={100} // or whatever the max budget is
                            />
                        </div>
                        <TextField
                            label="Occasion"
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            fullWidth
                            style={{ marginTop: '20px' }}
                        />
                        {/* INTERESTS */}
                        <FormControl style={{ marginTop: '20px'}}>
                            <InputLabel>Interests</InputLabel>
                            <Select
                                multiple
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                input={<Input />}
                                renderValue={(selected) => (
                                    <div style={{display: 'inline-block', width: '100%'}}>
                                        {selected.map((value) => (
                                            <Chip style={{}} key={value} label={value} />
                                        ))}
                                    </div>
                                )}
                            >
                                {interestList.map((interest) => (
                                    <MenuItem value={interest}>{interest}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* DISINTERESTS */}
                        <FormControl style={{ marginTop: '20px', width: '100%' }}>
                            <InputLabel>Disinterests</InputLabel>
                            <Select
                                multiple
                                value={disinterests}
                                onChange={(e) => setDisinterests(e.target.value)}
                                input={<Input />}
                                renderValue={(selected) => (
                                    <div>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </div>
                                )}
                            >
                                {interestList.map((interest) => (
                                    <MenuItem value={interest}>{interest}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* TODO: Create way to gauge the persons preferences. */}
                        <TextField
                            label="Open-ended addition"
                            value={openEndedAddition}
                            onChange={(e) => setOpenEndedAddition(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            style={{ marginTop: '20px' }}
                        />
                        <Button disabled={ isLoadingData ? isLoadingData : false } variant="contained" color="primary"  onClick={sendInitialMessage} style={{ marginTop: '20px' }}>
                            Submit
                        </Button>
                        { isLoadingData && (
                            <Typography variant="body2" color="text.secondary" style={{ marginTop: '20px' }}>
                                Loading...
                                Insert cool loading animation here
                            </Typography>
                        )}
                    </div>
                    </>
                )}
                <p>{data ? data.message : "No data yet"}</p>
                <p className='errorMessage'>{errorMessage ? errorMessage : ""}</p>

                {data && data.map((input, index) => {

                    return (
                        <>
                            <div>
                                <p>Who is the gift for?</p>
                                {index === 0 && (
                                    <p style={{padding: 25, backgroundColor: '#224'}}>
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
                                    <p style={{padding: 25, backgroundColor: '#224'}}>
                                        <p>
                                            <span>I like gifts related to: </span>
                                            {input.promptInfo.thumbsUpCategories && input.promptInfo.thumbsUpCategories.map((category) => {
                                                return (
                                                    <span key={category}>{category}, </span>
                                                )
                                            })}
                                        </p>
                                        <p>
                                            <span>I don't like the gifts related to: </span>
                                            {input.promptInfo.thumbsDownCategories && input.promptInfo.thumbsDownCategories.map((category) => {
                                                return (
                                                    <span key={category}>{category}, </span>
                                                )
                                            })}
                                        </p>
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

                                            <p className={'price'}>~ ${gift.price}</p>
                                            <a className={'amazonLink'} target={'_blank'} href={generateAmazonLink(gift.name)}>Search on Amazon</a>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )})}
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
            </header>
        </div>
    );
}

export default App;
