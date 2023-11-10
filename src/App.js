import React from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainView from "./MainView";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './CustomToastify.css'
import LoadingAnimation from "./components/LoadingAnimation";
import ReactGA from 'react-ga4';

ReactGA.initialize('G-GJ1HGT7CY6');

function App() {
    const [isLoadingData, setIsLoadingData] = React.useState(false);

    if (window.location.hostname !== "localhost") {
        ReactGA.send("pageview")
    }

    return (
        <Router>
            <div className={"app"}>
                <Routes>
                    <Route path="/c/:uuid" element={<MainView isLoading={isLoadingData} setIsLoading={setIsLoadingData} />} />
                    <Route path="/*" element={<MainView isLoading={isLoadingData} setIsLoading={setIsLoadingData} />} />
                </Routes>
            </div>
            { isLoadingData && (
                <LoadingAnimation />
            )}
            <ToastContainer
                position={"top-center"}
                autoClose={1250}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={"dark"}
            />
        </Router>
    );
}

export default App;
