import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {FeedComponent, PostsComponent, PostDetailComponent} from './posts';
import {ProfileBadgeComponent, ProfilesList, SuggestedProfilesList} from './profiles';

// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }

// const appEl = document.getElementById('root')
// if (appEl) {
//   ReactDOM.render(<App />, appEl);
// }
// const postsEl = document.getElementById("posted")
// if (postsEl) {
//   ReactDOM.render(<PostsComponent />, postsEl);
// }

const appEl = document.getElementById('root')
if (appEl) {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

const e = React.createElement

// const postsEl = document.getElementById('posted')
// if (postsEl) {
//   console.log(postsEl.dataset)
//   const posted = ReactDOM.createRoot(document.getElementById('posted'))
//   posted.render(
//     <React.StrictMode>
//       <PostsComponent username={postsEl.dataset.username} canPost={postsEl.dataset.canPost} /> {/*passing down username from dataset */}
//     </React.StrictMode>
//   );
// }

const postsEl = document.getElementById('posted')
if (postsEl) {
  const posted = ReactDOM.createRoot(document.getElementById('posted'))
  posted.render(
    e(PostsComponent, postsEl.dataset)); //pass down dataset as well
}

//better way of passing down dataset vv
const postFeedEl = document.getElementById('posted-feed')
if (postFeedEl) {
  const postedFeed = ReactDOM.createRoot(document.getElementById('posted-feed'))
  postedFeed.render(
    e(FeedComponent, postFeedEl.dataset)); //pass down dataset as well
}

const profileSearchEl = document.getElementById('posted-profile-search')
if (profileSearchEl) {
  const postedProfileList = ReactDOM.createRoot(document.getElementById('posted-profile-search'))
  postedProfileList.render(
    e(ProfilesList, profileSearchEl.dataset)); //pass down dataset as well
}

const profileSuggestedEl = document.getElementById('posted-profile-suggested')
if (profileSuggestedEl) {
  const postedProfileSuggestedList = ReactDOM.createRoot(document.getElementById('posted-profile-suggested'))
  postedProfileSuggestedList.render(
    e(SuggestedProfilesList, profileSuggestedEl.dataset)); //pass down dataset as well
}

//const e = React.createElement //all below done all myself! had to change how done as react has changed since tutorial was published

const postsDetailElements = document.querySelectorAll(".posted-detail") //gets array of all divs with the class "posted-detail"

postsDetailElements.forEach(container => { //for each div in array
  const newone = ReactDOM.createRoot(container) //create a root for it (container is the div)
  newone.render( //render it
    e(PostDetailComponent, container.dataset)); //pass down dataset as well
})

const userProfileBadgeElements = document.querySelectorAll(".posted-profile-badge") //gets array of all divs with the class "posted-detail"

userProfileBadgeElements.forEach(container => { //for each div in array
  const newone = ReactDOM.createRoot(container) //create a root for it (container is the div)
  newone.render( //render it
    e(ProfileBadgeComponent, container.dataset)); //pass down dataset as well
})

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
