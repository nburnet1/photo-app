
import React from 'react';
import { useState, useEffect } from "react";
import {getHeaders} from './utils';
import Suggestion from "./Suggestion";

export default function Suggestions({token}) {

    const [suggestions, setSuggestions] = useState(null);

    // wrap all fetch function definitions and invocations
    // in a useEffect()
    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch('/api/suggestions', {
                headers: getHeaders(token)
            });
            const data = await response.json();
            setSuggestions(data);
        }
        fetchPosts();
    }, [token]);



    if (!suggestions) {
        return '';
    }
    return (

        suggestions.map(suggestion =>{
            return(<Suggestion suggestion={suggestion} token={token}/>);
        })


    );

}