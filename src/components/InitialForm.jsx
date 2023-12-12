import {ThemeProvider} from "@mui/material/styles";
import {
    Box, Button,
    FormControl,
    Slider,
    TextField,
    Typography,
    Fade,
    Autocomplete,
} from "@mui/material";
import React, {useState} from "react";
import {ReactComponent as EditIcon} from "../icons/pen-to-square-regular.svg";


const InitialForm = ({
     theme,
     age,
     setAge,
     gender,
     setGender,
     relationship,
     setRelationship,
     budgetRange,
     setBudgetRange,
     occasion,
     setOccasion,
     interestList,
     interests,
     setInterests,
     disinterests,
     setDisinterests,
     openEndedAddition,
     setOpenEndedAddition,
     isLoadingData,
     initialSubmit,
     budgetScale
    }) => {

    console.log("interstsList:", interestList);

    const [currentForm, setCurrentForm] = useState(0);

    const occasionsList = [
        "Birthday",
        "Christmas",
        "Anniversary",
        "Wedding",
        "Engagement",
        "Valentine's Day",
        "Mother's Day",
        "Father's Day",
        "Easter",
        "Hanukkah",
        "Diwali",
        "Ramadan/Eid",
        "New Year",
        "Graduation",
        "Baby Shower",
        "Bridal Shower",
        "Housewarming",
        "Retirement",
        "Promotion/Career Achievement",
        "Thanksgiving",
        "Baptism/Christening",
        "Bar Mitzvah",
        "Bat Mitzvah",
        "Confirmation",
        "First Communion",
        "Quinceañera",
        "Sweet Sixteen",
        "Friendship Day",
        "Sympathy/Condolence",
        "Get Well Soon",
        "Bon Voyage/Travel",
        "New Job",
        "Passover",
        "Kwanzaa",
        "Halloween",
        "Veterans Day",
        "Independence Day",
        "St. Patrick's Day",
        "Teacher Appreciation",
        "New Baby Arrival",
        "Back to School",
        "Earth Day",
        "Chinese New Year",
        "Just Because",
        "Apology/Make Up"
    ];

    const relationshipsList = [
        "Brother",
        "Sister",
        "Mom",
        "Dad",
        "Son",
        "Daughter",
        "Wife",
        "Husband",
        "Friend",
        "Girlfriend",
        "Boyfriend",
        "Grandmother",
        "Grandfather",
        "Great-grandmother",
        "Great-grandfather",
        "Aunt",
        "Uncle",
        "Niece",
        "Nephew",
        "Cousin",
        "Mother-in-law",
        "Father-in-law",
        "Sister-in-law",
        "Brother-in-law",
        "Daughter-in-law",
        "Son-in-law",
        "Step-mother",
        "Step-father",
        "Step-sister",
        "Step-brother",
        "Step-son",
        "Step-daughter",
        "Godmother",
        "Godfather",
        "Goddaughter",
        "Godson",
        "Fiancée",
        "Fiancé",
        "Teacher",
        "Professor"
    ];

    const onKeyDown = (e) => {
        if(e.keyCode === 13){
            console.log('value', e.target.value);
            setCurrentForm((prev) => prev + 1);
        }
    }

    const formComponents = [
        <FormControl fullWidth margin="normal">
            <TextField
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={onKeyDown}
            />
        </FormControl>,
        // <FormControl fullWidth margin="normal">
        //     <InputLabel>Gender</InputLabel>
        //     <Select value={gender} onChange={(e) => setGender(e.target.value)}>
        //
        //     </Select>
        // </FormControl>,
        <Autocomplete
            freeSolo // allows user to enter any value, even if it's not in the list
            options={relationshipsList}
            value={relationship || ""}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Relationship"
                    variant="outlined"
                    onChange={(e) => setRelationship(e.target.value)}
                />
            )}
            onInputChange={(event, newValue) => {
                setRelationship(newValue);
            }}
            onKeyDown={onKeyDown}
        />,
        <FormControl fullWidth margin="normal">
            <Typography gutterBottom>Budget Range ${budgetScale(budgetRange[0])} - ${budgetScale(budgetRange[1])}</Typography>
            <Slider
                value={budgetRange}
                onChange={(e, newValue) => setBudgetRange(newValue)}
                valueLabelDisplay="auto"
                step={1}
                scale={x => budgetScale(x)}
                aria-label={`$${budgetRange[0]} - $${budgetRange[1]}`}
                valueLabelFormat={(value) => {
                    return `$${value}`;
                }}
                max={19}
                onKeyDown={onKeyDown}
            />
        </FormControl>,
        <Autocomplete
            freeSolo // allows user to enter any value, even if it's not in the list
            options={occasionsList}
            value={occasion || ""}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Occations"
                    variant="outlined"
                    onChange={(e) => setOccasion(e.target.value || "")}
                />
            )}
            onInputChange={(event, newValue) => {
                console.log("new value:", newValue)
                setOccasion(newValue || "");
            }}
            onKeyDown={onKeyDown}
        />,
        <Autocomplete
            multiple
            freeSolo
            options={interestList || []}
            value={interests || []}
            onChange={(event, newValue) => {
                setInterests(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Interests"
                    variant="outlined"
                />
            )}
        />,
        // <FormControl fullWidth margin="normal">
        //     <TextField
        //         label="Open Ended Addition"
        //         multiline
        //         rows={4}
        //         value={openEndedAddition}
        //         onChange={(e) => setOpenEndedAddition(e.target.value)}
        //     />
        // </FormControl>
    ]

    const formComponentRecap = [
        age ? `${age} year old` : 'No age specified',
        relationship ? `${relationship}` : 'No relationship specified',
        budgetRange ?  `$${budgetScale(budgetRange[0])} – $${budgetScale(budgetRange[1])}` : 'No Budget Range',
        occasion ? `For ${occasion}` : 'No occasion specified',
        interests ? `They're interested in: ${interests}` : 'No Interests specified',
        openEndedAddition ? `Open Ended Addition: ${openEndedAddition}` : 'No Open Ended Addition specified',
    ];

    const handleNext = () => {
        setCurrentForm((prev) => prev + 1);
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ p: 4, maxWidth: '600px', margin: '0 auto' }}>
                    <Typography variant="h3" gutterBottom>
                        Who is this gift for?
                    </Typography>

                    { formComponentRecap.map((formElement, index) => {
                        if(index < currentForm){
                            return (
                                <div>
                                    <Typography variant="header3" gutterBottom>
                                        {formElement}
                                    </Typography>
                                    <span style={{marginLeft: 10}} onClick={()=>{setCurrentForm(index)}}>
                                        <EditIcon width={20} color={'#ccc'}/>
                                    </span>
                                </div>
                            )
                        }
                    })}

                    { formComponents.map((formElement, index) =>
                        <Fade in={index === currentForm} hidden={index !== currentForm} timeout={500}>
                            {/*<Slide direction="up" in={index === currentForm} hidden={index !== currentForm} timeout={500}>*/}
                                <div key={currentForm} >
                                    { formComponents[currentForm]}
                                </div>

                            {/*</Slide>*/}
                        </Fade>
                    )}

                    {currentForm < formComponents.length - 1 && (
                        <Button onClick={handleNext} variant="contained">
                            {!true ? 'Skip' : 'Next'}
                        </Button>
                    )}
                    {currentForm === formComponents.length - 1 && (
                        <Button disabled={isLoadingData} variant="contained" color="primary" onClick={initialSubmit}>
                            Submit
                        </Button>
                    )}
                </Box>
            </ThemeProvider>
        </>
    );
}

export default InitialForm;
