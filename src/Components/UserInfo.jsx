import { useState } from 'react'

import './UserInfo.scss'
import axios from 'axios'
import ShinyText from '../../ReactBitsComponents/ShinyText'
import SpotlightCard from '../../ReactBitsComponents/SpotlightCard/SpotlightCard'
import ScrambledText from '../../ReactBitsComponents/ScrambledText/ScrambledText'
export default function UserUnfo() {

    const [userData, setUserData] = useState({})
    const [repoData, setRepoData] = useState({})
    const [loading, setLoading] = useState(true)
    const [userName, setUserName] = useState("Saurabh209")
    const HandleUserFind = async () => {
        try {
            const [userInfo, repoInfo] = await Promise.all([
                axios.get(`https://api.github.com/users/${userName}`),
                axios.get(`https://api.github.com/users/${userName}/repos`),
            ]);

            const formattedDate = formatDate(userInfo.data.created_at)
            const filteredUser = {
                profileLogo: userInfo.data.avatar_url,
                bio: userInfo.data.bio,
                website: userInfo.data.blog,
                company: userInfo.data.company,
                createdAt: formattedDate,
                email: userInfo.data.email,
                followers: userInfo.data.followers,
                following: userInfo.data.following,
                location: userInfo.data.location,
                userName: userInfo.data.login,
                fullName: userInfo.data.name,
                publicRepos: userInfo.data.public_repos,
                twitter: userInfo.data.twitter_username,
            };

            // repo array → map into clean list
            const filteredRepos = repoInfo.data.map(repo => ({
                name: repo.name,
                stars: repo.stargazers_count,
                forks: repo.forks,
                url: repo.html_url,
                language: repo.language,
                description: repo.description,
                createdAt: repo.created_at,
                size: repo.size
            }));

            setUserData(filteredUser);
            setRepoData(filteredRepos);
            setUserName("")
            setLoading(false);
        } catch (err) {
            console.error("GitHub API failed:", err);
            setLoading(false);
        }
    };

    const formatDate = (raw) => {
        const date = new Date(raw);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    console.log(userData)
    return (
        <main className='userInfoMainContainer'>

            {/* navbar */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    padding: "10px 20px",
                    borderBottom: "2px solid #333",
                    fontFamily: "monospace",
                }}
            >
                <div className='LogoContainer'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="github" class="lucide lucide-github w-8 h-8 text-gh-accent"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                    <span style={{ fontWeight: "bold", cursor: "default", letterSpacing: "0.5px", fontSize: "20px" }}>
                        Github Report Card
                    </span>
                </div>

                <div


                >
                    <input className='userInput' value={userName} type="text" placeholder=" search Saurabh209" onChange={(e) => { setUserName(e.target.value) }} />
                    <button className='userSubmitButton' onClick={HandleUserFind}>Find User</button>
                </div>

                {/* 
                {!loading &&
                    <span
                    >
                        <div
                            style={{
                                color: "#3bff52ff",
                                cursor: "default",
                                fontWeight: "bold",

                            }}
                        // onClick={HandleLogout}
                        >
                            Download
                        </div>


                    </span>
                } */}


            </div>
            {/* navbar end */}


            {!loading &&
                <>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(6, 6, 6, 0.6)">
                        <div className='userInfoCard'>
                            <div className='userPersonalInfoContainer'>
                                <section className='userProfileLogoContainer'>
                                    <div className='imageWrapper'>
                                        <img src={userData.profileLogo} alt="" />
                                    </div>

                                </section>
                                <section className='userProfileBioContainer'>
                                    <div className='userNameContainer'>
                                        <div className='userName'>
                                            <h2 className=''>{userData.fullName}</h2>
                                            <p className=''>{` @${userData.userName}`}</p>
                                        </div>


                                        <div className='followersFollowing'>

                                            {/* followers */}
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="users"
                                                    className="lucide lucide-users w-8 h-8 text-gh-green"
                                                >
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                    <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                                    <circle cx="9" cy="7" r="4" />
                                                </svg>

                                                <p>{`Followers: ${userData.followers}`}</p>
                                            </div>

                                            {/* following */}
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="user-plus"
                                                    className="lucide lucide-user-plus w-8 h-8 text-gh-purple"
                                                >
                                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                                    <circle cx="9" cy="7" r="4" />
                                                    <line x1="19" x2="19" y1="8" y2="14" />
                                                    <line x1="22" x2="16" y1="11" y2="11" />
                                                </svg>

                                                <p>{`Following: ${userData.following}`}</p>
                                            </div>

                                            {/* repoCount */}
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="w-8 h-8 text-gh-accent"
                                                >
                                                    <path d="M12 7v14"></path>
                                                    <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                                                </svg>

                                                <p>{`Public Repos: ${userData.publicRepos}`}</p>
                                            </div>

                                        </div>
                                    </div>

                                    <div className='bioContainer'>
                                        {/* <span>Bio: </span> {`${userData.bio}`} */}

                                        <ShinyText
                                            text={userData.bio}
                                            disabled={false}
                                            speed={3}
                                            className='custom-class'
                                        />

                                    </div>
                                    <div className='userLinksContainer'>

                                        {userData.company &&
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="building"
                                                    className="lucide lucide-building w-4 h-4"
                                                >
                                                    <path d="M12 10h.01" />
                                                    <path d="M12 14h.01" />
                                                    <path d="M12 6h.01" />
                                                    <path d="M16 10h.01" />
                                                    <path d="M16 14h.01" />
                                                    <path d="M16 6h.01" />
                                                    <path d="M8 10h.01" />
                                                    <path d="M8 14h.01" />
                                                    <path d="M8 6h.01" />
                                                    <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
                                                    <rect x="4" y="2" width="16" height="20" rx="2" />
                                                </svg>

                                                <ShinyText
                                                    text={userData.company}
                                                    disabled={false}
                                                    speed={3}
                                                    className='custom-class'
                                                />

                                            </div>
                                        }


                                        {userData.twitter &&
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="twitter"
                                                    className="lucide lucide-twitter w-4 h-4"
                                                >
                                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                                </svg>

                                                <ShinyText
                                                    text={userData.twitter}
                                                    disabled={false}
                                                    speed={3}
                                                    className='custom-class'
                                                />
                                            </div>
                                        }
                                        {userData.location &&
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="map-pin"
                                                    className="lucide lucide-map-pin w-4 h-4"
                                                >
                                                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                                                    <circle cx="12" cy="10" r="3" />
                                                </svg>

                                                <ShinyText
                                                    text={userData.location}
                                                    disabled={false}
                                                    speed={3}
                                                    className='custom-class'
                                                />
                                            </div>
                                        }

                                        {userData.createdAt &&
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    data-lucide="calendar"
                                                    className="lucide lucide-calendar w-4 h-4"
                                                >
                                                    <path d="M8 2v4"></path>
                                                    <path d="M16 2v4"></path>
                                                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                                                    <path d="M3 10h18"></path>
                                                </svg>


                                                <ShinyText
                                                    text={`Joined ${userData.createdAt}`}
                                                    disabled={false}
                                                    speed={3}
                                                    className='custom-class'
                                                />
                                            </div>
                                        }


                                        {/* <div><ShinyText
                                            text={userData.email}
                                            disabled={false}
                                            speed={3}
                                            className='custom-class'
                                        /></div> */}







                                    </div>
                                </section>
                            </div>
                            <div className='userStatsInfoContainer'>
                                <section className='repoContainer'>

                                </section>
                                <section className='graphsContainer'>

                                </section>

                            </div>
                        </div>
                    </SpotlightCard>
                </>
            }





        </main>
    )
}
