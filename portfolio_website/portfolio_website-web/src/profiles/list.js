import {useEffect, useState} from 'react'
import {ProfileSearchBadge, ProfileSuggestedBadge} from './detail'
import {apiProfileList, apiPopularProfileList, apiSuggestedProfileList} from './lookup'

export function ProfilesList(props) {
    const [profiles, setProfiles] = useState([]) //all profiles
    // const [nextUrl, setNextUrl] = useState([null]) //url for next page of posts
    const [profilesDidSet, setProfilesDidSet] = useState(false) //used to prevent constant lookups

    useEffect(() => {
    if (profilesDidSet === false) {
        const handleProfileListLookup = (response, status) => { //callback for once the lookup gives a response and status
        if (status === 200){
            // setNextUrl(response.next) //setting next url to next page url from the pagination response
            setProfiles(response) //updates profiles list component with response (query set items for that page)
            setProfilesDidSet(true)
        } else {
            alert("There was an error")
        }
        }
        if (props.query){
            apiProfileList(props.query, handleProfileListLookup)
        } else { //if no query is set just get all profiles in order from most followers to least
        apiPopularProfileList(handleProfileListLookup)
        }
    }
    }, [setProfiles, profilesDidSet, setProfilesDidSet, props.query])

    //if profiles were found and added to array
    if (profiles.length > 0) { 
        return <div class="row">
        {profiles.map((item, index)=>{ //iterates through list of profiles
        return <ProfileSearchBadge profile={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} /> //rendering profile
      })}
      {/* {nextUrl !== null && <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load more...</button>} */}
      </div>
    } else {
        return <div class="d-flex justify-content-center p-3 rounded-3 shadow-lg">
            <div>
                  <strong class="d-block">No profiles found</strong>
                  <small>We couldn't find any profiles similar to the name you searched</small>
            </div>
      </div>
    }
    
    // return <div class="row">
    //     {profiles.map((item, index)=>{ //iterates through list of profiles
    //     return <ProfileInfo profile={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} /> //rendering profile
    //   })}
    //   {/* {nextUrl !== null && <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load more...</button>} */}
    //   </div>
}

export function SuggestedProfilesList(props) {
    const [profiles, setProfiles] = useState([]) //all profiles
    const [profilesDidSet, setProfilesDidSet] = useState(false) //used to prevent constant lookups
    const [showSuggested, setShowSuggested] = useState(true)
    
    useEffect(() => {
        if (profilesDidSet === false) {
            const handleSuggestedProfileListLookup = (response, status) => { //callback for once the lookup gives a response and status
            if (status === 200){
                setProfiles(response) //updates profiles list component with response (query set items for that page)
                setProfilesDidSet(true)
            } else {
                alert("There was an error")
            }
            }
            apiSuggestedProfileList(handleSuggestedProfileListLookup)
        }
        }, [setProfiles, profilesDidSet, setProfilesDidSet])
    
    const handleCloseSuggested = (event) => {
        event.preventDefault()
        setShowSuggested(false)
    }
    const filteredProfiles = profiles.filter(profile => {
        const profileUrl = `/profile/${profile.username}` //if the users profile is currently being viewed
        return window.location.pathname !== profileUrl //will filter it out if it returns false
    })

    if ((filteredProfiles.length > 0) && showSuggested) { //if there are any profiles in the array and the close suggested button hasnt been pressed
        return <div class="card row mt-3 p-2"> {/* without borders is just "row mt-3" */}
            <div class="col-flex">
                <span class="text-secondary float-start mb-2"><b>Suggested for you</b></span>
                <button class="btn btn-secondary p-1 lh-1 float-end" type="button" onClick={handleCloseSuggested}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
                </button>
            </div>
            <div class="row">
                <ul class="d-flex overflow-auto justify-content-center">
                    {filteredProfiles.map((item, index)=>{ //iterates through list of profiles
                        return <ProfileSuggestedBadge profile={item} key={`${index}-${item.id}`} /> //rendering profile
                    })}
                </ul>
            </div>
        </div>
    } else {
        return null
    }
}