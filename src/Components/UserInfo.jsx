import { useState } from 'react'

import './UserInfo.scss'
import axios from 'axios'
import SpotlightCard from '../../ReactBitsComponents/SpotlightCard/SpotlightCard'

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

            const filteredUser = {
                profileLogo: userInfo.data.avatar_url,
                bio: userInfo.data.bio,
                website: userInfo.data.blog,
                company: userInfo.data.company,
                createdAt: userInfo.data.created_at,
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
                description:repo.description,
            }));

            setUserData(filteredUser);
            setRepoData(filteredRepos);
            setLoading(false);
        } catch (err) {
            console.error("GitHub API failed:", err);
            setLoading(false);
        }
    };

    console.log(repoData)
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
                <span style={{ fontWeight: "bold", cursor: "default", letterSpacing: "0.5px", fontSize: "16px" }}>
                    ⚙️ Github Report Card
                </span>
                <div


                >
                    <input className='userInput' type="text" placeholder=" i.e. Saurabh209" onChange={(e) => { setUserName(e.target.value) }} />
                    <button className='userSubmitButton' onClick={HandleUserFind}>Find User</button>
                </div>


                {!loading ?
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


                    </span> :
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

                        </div>


                    </span>
                }


            </div>
            {/* navbar end */}


            {!loading &&
                <>
                    <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(255, 255, 255, 0.23)">
                        <div className='userInfoCard'>
                            <div className='userPersonalInfoContainer'>
                                <section className='userProfileLogoContainer'>
                                    <div className='imageWrapper'>
                                        <img src={userData.profileLogo} alt="" />
                                    </div>

                                </section>
                                <section className='userProfileBioContainer'>
                                    <div className='userNameContainer'>
                                        <h2 className=''>{userData.fullName}</h2>
                                        <p className=''>{` @${userData.userName}`}</p>
                                        <div className='followersFollowing'>
                                            <p>{`Followers: ${userData.followers}`}</p>
                                            <p>{`Following: ${userData.following}`}</p>
                                        </div>
                                    </div>

                                    <div className='bioContainer'>
                                        <p>
                                            {`${userData.bio}`}
                                        </p>
                                    </div>
                                    <div>
                                        <p>{userData.company}</p>
                                        <p>{userData.twitter}</p>
                                        <p>{userData.location}</p>
                                        <p>{userData.email}</p>
                                    </div>
                                </section>
                            </div>
                            <div className='userStatsInfoContainer'>
                                <section className='repoContainer'>

                                </section>
                            </div>
                        </div>
                    </SpotlightCard>
                </>
            }





        </main>
    )
}
