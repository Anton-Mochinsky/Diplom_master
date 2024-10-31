import React from 'react';
import './App.css';
import {BrowserRouter} from "react-router-dom";
import {AuthWrapper} from "../AuthWrapper/AuthWrapper";
import {MessageForm} from "../MessageForm/MessageForm";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";


function App() {
    const window_message = useSelector((state: RootState)=>  state.systemReducer.window_message);
    console.log(process.env.PUBLIC_URL)
    return (
       <BrowserRouter basename={process.env.PUBLIC_URL}>
           <AuthWrapper/>
           {window_message && <MessageForm message={window_message}/>}
       </BrowserRouter>
    );
}

export default App;
