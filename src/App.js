import './App.css';
import React, {useState} from "react";
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
import generateAmazonLink from "./Amazon";

function App() {
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Form variables
    // const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [relationship, setRelationship] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 20]);
    const [occasion, setOccasion] = useState('');
    const [interests, setInterests] = useState([]);
    const [disinterests, setDisinterests] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [openEndedAddition, setOpenEndedAddition] = useState('');

    const sendInitialMessage = () => {
        const formData = {
            // name: name,
            age: age,
            gender: gender,
            relationship: relationship,
            // lowerBudgetRange: lowerBudgetRange,
            // upperBudgetRange: upperBudgetRange,
            upperBudgetRange: budgetRange[0],
            lowerBudgetRange: budgetRange[1],
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
                setData(response.data)
                setErrorMessage('')
            })
            .catch(function (error) {
                setErrorMessage(error.message);
                console.log(error);
            })
            .finally(function () {
                // always executed

            });
    }

    const budgetMinRange = 5;

    const handleBudgetRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (newValue[1] - newValue[0] < budgetMinRange) {
            if (activeThumb === 0) {
                const clamped = Math.min(newValue[0], 100 - budgetMinRange);
                setBudgetRange([clamped, clamped + budgetMinRange]);
            } else {
                const clamped = Math.max(newValue[1], budgetMinRange);
                setBudgetRange([clamped - budgetMinRange, clamped]);
            }
        } else {
            setBudgetRange(newValue);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <p>Who is the gift for?</p>
                <div style={{ padding: '20px' }}>
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
                            <FormControlLabel value="" control={<Radio />} label="Exclude from data" />
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
                    <FormControl style={{ marginTop: '20px', width: '100%' }}>
                        <InputLabel>Interests</InputLabel>
                        <Select
                            multiple
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            input={<Input />}
                            renderValue={(selected) => (
                                <div>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </div>
                            )}
                        >
                            <MenuItem value="Sport">Sport</MenuItem>
                            <MenuItem value="Reading">Reading</MenuItem>
                            <MenuItem value="Music">Music</MenuItem>
                        </Select>
                    </FormControl>
                    {/* Repeat for disinterests */}
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
                    <Button variant="contained" color="primary" onClick={sendInitialMessage} style={{ marginTop: '20px' }}>
                        Submit
                    </Button>
                </div>
                <p>{data ? data.message : "No data yet"}</p>
                <p className='errorMessage'>{errorMessage ? errorMessage : ""}</p>

                <div className={'giftList'}>
                    {data && data.map((gift, index) => {
                        return (
                            <div key={index} className={'giftCard'}>
                                <h1>{gift.name}</h1>
                                <p className={'description'}>{gift.description}</p>
                                <p className={'category'}>{gift.gift_topic}</p>
                                <div className={'keywords'}>
                                    {gift.keywords.split(',').map((keyword, index) => {
                                        return (
                                            <p key={index}>{keyword}</p>
                                        )
                                    })}
                                </div>

                                <p className={'price'}>~ ${gift.price}</p>
                            </div>
                        )
                    })}
                </div>
            </header>
        </div>
    );
}

export default App;
