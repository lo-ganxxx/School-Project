import {useEffect, useState} from 'react'
import {ProfileInfo} from './detail'
import {apiProfileList} from './lookup'

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
        apiProfileList(props.query, handleProfileListLookup)
    }
    }, [setProfiles, profilesDidSet, setProfilesDidSet, props.query])

    return <div class="row">
        {profiles.map((item, index)=>{ //iterates through list of profiles
        return <ProfileInfo profile={item} className='my-5 py-5 border bg-white text-dark' key={`${index}-${item.id}`} /> //rendering profile
      })}
      {/* {nextUrl !== null && <button onClick={handleLoadNext} className='btn btn-outline-primary'>Load more...</button>} */}
      </div>
}