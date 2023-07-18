import React from 'react'
import {useEffect, useState} from 'react'

import {apiProfileDetail} from './lookup'

export function ProfileBadge(props) {
    const {username} = props
    const [didLookup, setDidLookup] = useState(false)
    const [profile, setProfile] = useState(null)
    const handleBackendLookup = (response, status) => {
        if (status === 200) {
        setProfile(response)
        } else {
        alert("There was an error finding the profile.")
        }
    }
    useEffect(()=>{
        if (didLookup === false) {
        
        apiProfileDetail(username, handleBackendLookup)
        setDidLookup(true)
        }
    }, [username, didLookup, setDidLookup])

    return profile ? <span>{profile.first_name}</span> : null
}