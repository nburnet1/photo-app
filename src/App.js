import React from 'react';
import NavLinks from './NavLinks';
import Posts from "./Posts";
import Stories from "./Stories";
import Suggestions from "./Suggestions";
import Profile from "./Profile";



export default function App ({token}) { 
    console.log('access token:', token);
    
    return (
        <div>
            
            {/* Navbar */}
            <nav className="main-nav">
                <h1>Photo App</h1>
                <NavLinks token={token} />
            </nav>
           
           {/* Right Panel */}
            <aside>
                <header>
                    <Profile token={token}/>
                </header>
                <div className="suggestions">
                    <p className="suggestion-text">Suggestions for you</p>
                    <div>
                        <Suggestions token={token} />
                    </div>
                </div>
            </aside>

            <main className={"content"}>
                {/* Stories */}
                <header className="stories">
                    <Stories token={token} />
                </header>

                {/* Posts */}
                <div id="posts">
                    <Posts token={token} />
                </div>

            </main>

        </div>
    );
    
}