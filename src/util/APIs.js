import axios from "axios";
import {UUID} from "./UUID";
import {saveConversation} from "./Converasations";
import {useNavigate, useNavigation} from "react-router-dom";

const endpoint = 'https://api.gifts.henhen1227.com';

export const sendInitialMessage = (formData, setIsLoading, setData, setErrorMessage, setConversations, navigate) => {
    setIsLoading(true);

    axios.post(`${endpoint}/sendInitialMessage`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: formData
    })
        .then(function (response) {
            const newData = {uuid: UUID(), data: [{promptInfo: formData, gifts: response.data.gifts}]}
            console.log("new data:", newData);
            setData(newData);
            saveConversation(response.data.conversation_title, newData.uuid, [{promptInfo: formData, gifts: response.data.gifts}], setConversations);
            setErrorMessage('');
            navigate('/c/' + newData.uuid);
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

export const sendFollowUpMessage = (setIsLoading, thumbsUpCategories, thumbsDownCategories, setData, data, setErrorMessage, clearChat, setConversations) => {
    setIsLoading(true);

    console.log("data:", data);
    console.log("uuid:", data.uuid);

    const followUpData = {
        thumbsUpCategories: thumbsUpCategories,
        thumbsDownCategories: thumbsDownCategories,
    }

    axios.post(`${endpoint}/sendFollowUpMessage`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            previousPrompts: data.data,
            formData: followUpData,
        }
    })
        .then(function (response) {
            const newData = [
                ...data.data, // Load all previous data
                { // Add latest to the end
                    promptInfo: followUpData,
                    gifts: response.data.gifts,
                }
            ];

            setData({
                uuid: data.uuid,
                data: newData
            });
            saveConversation(response.data.title, data.uuid, newData, setConversations)
            setErrorMessage('')
        })
        .catch(function (error) {
            setErrorMessage(error.message);
            console.log('error', error);
        })
        .finally(function () {
            clearChat();
            setIsLoading(false);
        });
}

export const sendExpandUponMessage = (setIsLoading, targetGift, setData, data, setErrorMessage, clearChat, setConversations) => {
    setIsLoading(true);

    console.log("data:", data);
    console.log("uuid:", data.uuid);

    const followUpData = {
        type: 'expandUpon',
        targetGift: targetGift,
    }

    axios.post(`${endpoint}/sendExpandUponMessage`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            previousPrompts: data.data,
            formData: followUpData,
        }
    })
        .then(function (response) {
            const newData = [
                ...data.data, // Load all previous data
                { // Add latest to the end
                    promptInfo: followUpData,
                    gifts: response.data.gifts,
                }
            ];
            console.log("new data:", newData);
            setData({
                uuid: data.uuid,
                data: newData
            });
            saveConversation(response.data.title, data.uuid, newData, setConversations)
            setErrorMessage('')
        })
        .catch(function (error) {
            setErrorMessage(error.message);
            console.log('error', error);
        })
        .finally(function () {
            clearChat();
            setIsLoading(false);
        });
}
