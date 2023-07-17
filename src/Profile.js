import React from 'react';
import { useState, useEffect } from "react";
import {getHeaders} from './utils';

export default function Profile({token}) {

    const [profile, setProfile] = useState(null);

    // wrap all fetch function definitions and invocations
    // in a useEffect()
    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch('/api/profile/', {
                headers: getHeaders(token)
            });
            const data = await response.json();
            setProfile(data);
        }
        fetchProfile();
    }, [token]);



    if (!profile) {
        return '';
    }

    return (

        <div>
            <img className="pic" src={profile.thumb_url} alt="Profile pic for noah"/>
            <h2>{profile.username}</h2>
        </div>

    );

}