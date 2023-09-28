import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainView from "./MainView";


function App() {
    return (
        <Router>
            <div className={"app"}>
                <Routes>
                    <Route path="/c/:uuid" element={<MainView />} />
                    <Route path="/*" element={<MainView />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
