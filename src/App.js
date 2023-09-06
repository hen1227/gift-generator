import './App.css';
import React, {useState} from "react";
import axios from 'axios';


function App() {
    const [data, setData] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Form variables
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [relationship, setRelationship] = useState('');
    const [lowerBudgetRange, setLowerBudgetRange] = useState(0);
    const [upperBudgetRange, setUpperBudgetRange] = useState(20);
    const [occasion, setOccasion] = useState('');
    const [interests, setInterests] = useState([]);
    const [disinterests, setDisinterests] = useState([]);
    const [preferences, setPreferences] = useState([]);
    const [openEndedAddition, setOpenEndedAddition] = useState('');


    const sendInitialMessage = () => {
        const formData = {
            name: name,
            age: age,
            gender: gender,
            relationship: relationship,
            lowerBudgetRange: lowerBudgetRange,
            upperBudgetRange: upperBudgetRange,
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
                setData(response.data)
                setErrorMessage('')
                console.log(response);
            })
            .catch(function (error) {
                setErrorMessage(error.message);
                console.log(error);
            })
            .finally(function () {
                // always executed

            });
    }

  return (
    <div className="App">
      <header className="App-header">

          <p>A form to provide information about the recipient!</p>
            <p>{data ? data.message : "No data yet"}</p>
            <p className='errorMessage'>{errorMessage ? errorMessage : ""}</p>
          <button onClick={sendInitialMessage}>Get data from Backend</button>
      </header>
    </div>
  );
}

export default App;
