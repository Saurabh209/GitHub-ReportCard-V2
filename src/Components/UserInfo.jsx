import { useState } from "react";
import * as htmlToImage from "html-to-image";
import "./UserInfo.scss";
import axios from "axios";
import ShinyText from "../../ReactBitsComponents/ShinyText";
import { Link } from "react-router-dom";
import Groq from "groq-sdk";


// importing svg
import ViewAllRepoLink from "../../public/icons8-external-link.svg";

export default function UserUnfo() {

    // AI client
    const client = new Groq({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    // states
    const [userData, setUserData] = useState({});
    const [repoData, setRepoData] = useState({});
    const [generatedUserBio, setGeneratedUserBio] = useState("");
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Saurabh209");


    // function for downloading report card
    function downloadCard() {

        const node = document.getElementById("reportCard");

        htmlToImage.toPng(node)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = `${userData.userName ? userData.userName : userData.fullName}'s_Report_Card.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error("failed to download image", err);
            });

    }

    // function for download repository in zip format
    function handleSingleRepoDownload(username, repoName, defaultBranchName) {
        console.log(username, repoName, defaultBranchName)
        const link = document.createElement("a");
        link.href = `https://codeload.github.com/${username}/${repoName}/zip/refs/heads/${defaultBranchName}`;
        link.download = `${username}'s ${repoName}.zip`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }


    // function for fetching data from api and generate ai response
    const HandleUserFind = async () => {
        try {
            const [userInfo, repoInfo] = await Promise.all([
                axios.get(`https://api.github.com/users/${userName}`),
                axios.get(
                    `https://api.github.com/users/${userName}/repos?per_page=12&sort=updated`
                ),
            ]);
            let optimizedUserData = {
                company: userInfo.data.company,
                location: userInfo.data.location,
                username: userInfo.data.login,
                fullName: userInfo.data.name,
            };
            let optimizedRepoData = repoInfo.data.map((repo) => ({
                repoName: repo.name,
                language: repo.language,
                repoDescription: repo.description,
            }));

            if (!userInfo.data.bio) {
                let generatedBio = "";

                const res = await client.chat.completions.create({
                    model: "llama-3.1-8b-instant",
                    messages: [
                        {
                            role: "user",
                            content: `Write a 25-30 word third-person GitHub bio.
                             Only output the bio text, nothing else. User: 
                             ${JSON.stringify(optimizedUserData)} Repos: ${optimizedRepoData}`,
                        },
                    ],
                });
                generatedBio = res.choices[0].message.content;
                setGeneratedUserBio(generatedBio);
            }

            const formattedDate = formatDate(userInfo.data.created_at);
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
                url: userInfo.data.html_url,
            };
            // repo array → map into clean list
            const filteredRepos = repoInfo.data.map((repo) => ({
                name: repo.name,
                stars: repo.stargazers_count,
                forks: repo.forks,
                url: repo.html_url,
                language: repo.language,
                description: repo.description,
                createdAt: repo.created_at,
                size: repo.size,
                defaultBranchName: repo.default_branch
            }));

            setUserData(filteredUser);
            setRepoData(filteredRepos);
            setUserName("");
            setLoading(false);
            // console.log("testingBio: ", filteredRepos.bio)
        } catch (err) {
            console.error("GitHub API failed:", err);
            setLoading(false);
        }
    };

    const languageColors = {
        JavaScript: "#f1e05a",
        TypeScript: "#3178c6",
        HTML: "#e34c26",
        CSS: "#7c52baff",
        SCSS: "#c6538c",
        Python: "#3572A5",
        Java: "#b07219",
        "C++": "#f34b7d",
        C: "#555555",
        "C#": "#178600",
        PHP: "#4F5D95",
        Go: "#00ADD8",
        Rust: "#dea584",
        Swift: "#F05138",
        Dart: "#00B4AB",
        Kotlin: "#A97BFF",
        Shell: "#89e051",
        Ruby: "#701516",
        Solidity: "#AA6746",
    };
    // function for formatting date
    const formatDate = (raw) => {
        const date = new Date(raw);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };
    // format number to representation state i.e. 1k , 12k
    function formatNumber(num) {
        if (num >= 1_000_000_000) {
            return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
        }
        if (num >= 1_000_000) {
            return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
        }
        if (num >= 1_000) {
            return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
        }
        return num.toString();
    }
    // function for getting repo creted date  i.e. 69 days ago
    function formatAgo(date) {
        const created = new Date(date);
        const now = new Date();

        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const days = diffDays % 365;


        if (years === 0 && days === 0) return `Created Today`
        if (years === 0) return `Created ${days}d ago`;
        return `Created ${years}y ${days}d ago`;
    }



    return (
        <>

            {/* Original container for frontend */}
            <main className="userInfoMainContainer">
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
                    <div className="LogoContainer">
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
                            data-lucide="github"
                            className="lucide lucide-github w-8 h-8 text-gh-accent"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        <span
                            style={{
                                fontWeight: "bold",
                                cursor: "default",
                                letterSpacing: "0.5px",
                                fontSize: "20px",
                            }}
                        >
                            Github Report Card
                        </span>
                        {!loading &&
                            <div
                                style={{
                                    color: "#00ff88",
                                    cursor: "pointer",

                                }}
                                onClick={downloadCard} className="downloadButtonContainer">
                                <p>download</p>

                            </div>
                        }

                    </div>

                    <div>
                        <input
                            className="userInput"
                            value={userName}
                            type="text"
                            placeholder=" search Saurabh209"
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                        />
                        <button className="userSubmitButton" onClick={HandleUserFind}>
                            Find User
                        </button>
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

                {loading ?
                    <div className="projectInfoCOntainer">
                        <section class="aboutProject">
                            <div className="aboutProjectHeadingContainer">
                                <h2>About GitHub Report Card V2</h2>
                                <p>Track, Analyze & Showcase Your GitHub Journey in One Place</p>
                            </div>
                            <div className="aboutProjectBioContainer">
                                <p>GitHub Report Card v2 is a tool that analyzes a developer’s public GitHub activity and forges it into a clean, downloadable dashboard — showing stats like repositories, languages, contributions, and achievements. Think of it as a character stats screen, but for devs. Designed for clear insight, professional presentation, and effortless portfolio integration.</p>
                            </div>
                            <div className="aboutProjectFeatureContainer">
                                <div>
                                    <h3>📊 Activity-Based Grades</h3>
                                    <p>See your coding performance grades based on commits, PRs, and contributions</p>
                                </div>
                                <div>
                                    <h3>🤖 AI-Generated Bio</h3>
                                    <p>No bio? No problem! AI crafts one from your repos and activity</p>
                                </div>
                                <div>
                                    <h3>📥 Download Report Card</h3>
                                    <p>Save and share your beautiful report card with recruiters</p>
                                </div>
                                <div>
                                    <h3>🗂️ Quick Repo Downloads</h3>
                                    <p>Download up to 12 visible repos with a single click (more coming soon!)</p>
                                </div>
                                <div>
                                    <h3>📈 Contribution Graph</h3>
                                    <p>Visualize your GitHub activity with interactive contribution graphs and streak tracking</p>
                                </div>
                                <div>
                                    <h3>🏆 Achievement Badges</h3>
                                    <p>Earn and display badges based on your coding milestones and contributions</p>
                                </div>
                                <div>
                                    <h3>💻 Language Analytics</h3>
                                    <p>Beautiful charts showing your most-used programming languages and tech stack</p>
                                </div>
                                <div>
                                    <h3>⚡ Real-Time Stats</h3>
                                    <p>Live GitHub metrics including stars earned, commits, PRs merged, and issues resolved</p>
                                </div>
                                <div>
                                    <h3>🔍 Repository Insights</h3>
                                    <p>Deep dive into individual repo stats with code frequency and commit analysis</p>
                                </div>
                            </div>

                        </section>
                        <section class="aboutMe">

                        </section>

                    </div>
                    :
                    <div
                        //  id="reportCard" 
                        className="userInfoCard">
                        <div className="userPersonalInfoContainer">
                            {/* logoCOntainer */}
                            <section className="userProfileLogoContainer">
                                <div className="imageWrapper">
                                    <img src={userData.profileLogo} alt="" />
                                </div>
                            </section>

                            <section className="userProfileBioContainer">
                                <div className="userNameContainer">
                                    <div className="userName">
                                        <h2 className="">{userData.fullName}</h2>
                                        <p className="">{` @${userData.userName}`}</p>
                                    </div>

                                    <div className="followersFollowing">
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
                                            {/* <p>{`Followers: ${userData.followers}`}</p> */}
                                            <p>{`Followers: ${formatNumber(userData.followers)}`}</p>
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

                                {userData?.bio ? (
                                    <div className="bioContainer">
                                        <ShinyText
                                            text={userData.bio}
                                            disabled={false}
                                            speed={3}
                                            className="custom-class"
                                        />
                                    </div>
                                ) : (
                                    <div className="bioContainer  AI-generated-bio-container">
                                        {/* <p> {generatedUserBio}</p> */}
                                        <ShinyText
                                            text={generatedUserBio}
                                            disabled={false}
                                            speed={3}
                                            className="custom-class"
                                        />
                                        <div className="AI-generated-Text">
                                            <p>AI-Generated*</p>
                                        </div>
                                    </div>
                                )}
                                <div className="userLinksContainer">
                                    {userData.company && (
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
                                                className="custom-class"
                                            />
                                        </div>
                                    )}

                                    {userData.twitter && (
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
                                                className="custom-class"
                                            />
                                        </div>
                                    )}

                                    {userData.location && (
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
                                                className="custom-class"
                                            />
                                        </div>
                                    )}

                                    {userData.createdAt && (
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
                                                className="custom-class"
                                            />
                                        </div>
                                    )}


                                </div>


                            </section>
                        </div>

                        <div className="userStatsInfoContainer">
                            <section className="repoContainer">
                                {repoData.map((repo, index) => {
                                    // console.log("data: ", repo.name, repo.branchHead)
                                    let langColor = languageColors[repo.language] || "#9e9e9e";
                                    return (
                                        <Link target="_blank" key={index} to={`${repo.url}`}>
                                            <div className="singleRepo">
                                                <div className="singleRepoFirstRow">
                                                    <svg
                                                        aria-hidden="true"
                                                        height="12"
                                                        width="12"
                                                        viewBox="0 0 16 16"
                                                        className="octicon octicon-repo mr-1"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                                                    </svg>



                                                    <p>{repo.name}</p>
                                                </div>
                                                <div className="singleRepoSecondRow">
                                                    <p>
                                                        {repo.description
                                                            ? repo.description
                                                            : "no description provided for this repo"}
                                                    </p>
                                                </div>
                                                <div className="singleRepoThirdRow">
                                                    <div className="singleRepoThirdRowLeft">
                                                        {repo?.language &&
                                                            <div className="singleRepoThirdRowLng">
                                                                <span
                                                                    className="dot"
                                                                    style={{
                                                                        display: "inline-block",
                                                                        width: "8px",
                                                                        height: "8px",
                                                                        borderRadius: "50%",
                                                                        backgroundColor: langColor,
                                                                        marginRight: "4px",
                                                                    }}
                                                                ></span>
                                                                <p> {repo?.language}</p>
                                                            </div>

                                                        }

                                                        <div className="singleRepoThirdRowStars">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                data-lucide="star"
                                                                className="lucide lucide-star w-3 h-3"
                                                            >
                                                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                                            </svg>

                                                            <p>{formatNumber(repo?.stars)}</p>
                                                        </div>
                                                        <div className="singleRepoThirdRowForks">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                data-lucide="git-fork"
                                                                className="lucide lucide-git-fork w-3 h-3"
                                                            >
                                                                <circle cx="12" cy="18" r="3" />
                                                                <circle cx="6" cy="6" r="3" />
                                                                <circle cx="18" cy="6" r="3" />
                                                                <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                                                                <path d="M12 12v3" />
                                                            </svg>

                                                            <p>{formatNumber(repo?.forks)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="singleRepoThirdRowRight">
                                                        <p>{formatAgo(repo?.createdAt)}</p>
                                                    </div>
                                                </div>
                                                <div onClick={() => handleSingleRepoDownload(userData?.userName, repo.name, repo.defaultBranchName)} className="singleRepoDownloadButton">
                                                    <img src="/icons8-download-64.png" alt="" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                                {userData.publicRepos > 9 && (
                                    <a
                                        href={`${userData.url}?tab=repositories`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="viewMoreBtn">
                                            <span>
                                                <p>View All</p>
                                                <img src={ViewAllRepoLink} alt="" />
                                            </span>
                                        </div>
                                    </a>
                                )}
                            </section>

                            <section className="graphsContainer">
                                <div className="graphContainerRow_1">
                                    <div className="ContributionGraphContainer">
                                        <iframe src={`https://github-readme-activity-graph.vercel.app/graph?username=${userData?.userName}&theme=github-compact&area_color=185329&bg_color=4b4b4b&color=ffffff&hide_title=true&hide_border=true `} frameBorder="0"></iframe>
                                    </div>
                                    <div className="ContributionStatsContainer">
                                        <iframe src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData?.userName}&layout=donut&theme=dark&bg_color=4b4b4b&hide_border=true`} frameBorder="0"></iframe>
                                    </div>
                                </div>
                                <div className="graphContainerRow_2">

                                    <div className="ContributionStatsContainer">
                                        <iframe src={`https://github-readme-stats.vercel.app/api?username=${userData?.userName}&show_icons=true&theme=dark&bg_color=4b4b4b&hide_border=true&hide_title=true&,prs_merged,prs_merged_percentage`} frameBorder="0"></iframe>
                                    </div>
                                    {/* <div className="Contribution3dGraphContainer">
                                        <iframe src={`https://ssr-contributions-svg.vercel.app/_/${userData?.userName}?chart=3dbar&gap=0.6&scale=3&gradient=true&flatten=0&animation=fall&animation_delay=0.01&weeks=30&theme=green&dark=true`} frameborder="0"></iframe>
                                    </div> */}

                                </div>


                            </section>
                        </div>
                    </div>
                }
            </main>
            {/* Original container for frontend */}


            {/* Clone for download  */}
            <main id="reportCard" className="cloneUserInfoMainContainer cloneContainer">
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
                    <div className="cloneLogoContainer">
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
                            data-lucide="github"
                            className="lucide lucide-github w-8 h-8 text-gh-accent"
                        >
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                            <path d="M9 18c-4.51 2-5-2-7-2" />
                        </svg>
                        <span
                            style={{
                                fontWeight: "bold",
                                cursor: "default",
                                letterSpacing: "0.5px",
                                fontSize: "20px",
                            }}
                        >
                            {`${userData.userName ? userData.userName : userData.fullName}'s Report Card`}
                        </span>
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

                {!loading && (
                    <>
                        {/* <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(6, 6, 6, 0.72)"> */}
                        <div className="cloneUserInfoCard">
                            <div className="cloneUserPersonalInfoContainer">
                                {/* logoCOntainer */}
                                <section className="cloneUserProfileLogoContainer">
                                    <div className="cloneImageWrapper">
                                        <img src={userData.profileLogo} alt="" />
                                    </div>
                                </section>

                                <section className="cloneUserProfileBioContainer">
                                    <div className="userNameContainer">
                                        <div className="userName">
                                            <h2 className="">{userData.fullName}</h2>
                                            <p className="">{` @${userData.userName}`}</p>
                                        </div>

                                        <div className="followersFollowing">
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
                                                {/* <p>{`Followers: ${userData.followers}`}</p> */}
                                                <p>{`Followers: ${formatNumber(userData.followers)}`}</p>
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

                                    {userData?.bio ? (
                                        <div className="bioContainer">
                                            <ShinyText
                                                text={userData.bio}
                                                disabled={false}
                                                speed={3}
                                                className="custom-class"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bioContainer  AI-generated-bio-container">
                                            {/* <p> {generatedUserBio}</p> */}
                                            <ShinyText
                                                text={generatedUserBio}
                                                disabled={false}
                                                speed={3}
                                                className="custom-class"
                                            />
                                            <div className="AI-generated-Text">
                                                <p>AI-Generated*</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="userLinksContainer">
                                        {userData.company && (
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
                                                    className="custom-class"
                                                />
                                            </div>
                                        )}

                                        {userData.twitter && (
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
                                                    className="custom-class"
                                                />
                                            </div>
                                        )}

                                        {userData.location && (
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
                                                    className="custom-class"
                                                />
                                            </div>
                                        )}

                                        {userData.createdAt && (
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
                                                    className="custom-class"
                                                />
                                            </div>
                                        )}


                                    </div>


                                </section>
                            </div>

                            <div className="cloneUserStatsInfoContainer">
                                <section className="repoContainer">
                                    {repoData.map((repo, index) => {
                                        let langColor = languageColors[repo.language] || "#9e9e9e";
                                        return (

                                            <div key={index} className="singleRepo">
                                                <div className="singleRepoFirstRow">
                                                    <svg
                                                        aria-hidden="true"
                                                        height="12"
                                                        width="12"
                                                        viewBox="0 0 16 16"
                                                        className="octicon octicon-repo mr-1"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
                                                    </svg>



                                                    <p>{repo.name}</p>
                                                </div>
                                                <div className="singleRepoSecondRow">
                                                    <p>
                                                        {repo.description
                                                            ? repo.description
                                                            : "no description provided for this repo"}
                                                    </p>
                                                </div>
                                                <div className="singleRepoThirdRow">
                                                    <div className="singleRepoThirdRowLeft">
                                                        <div className="singleRepoThirdRowLng">
                                                            <span
                                                                className="dot"
                                                                style={{
                                                                    display: "inline-block",
                                                                    width: "8px",
                                                                    height: "8px",
                                                                    borderRadius: "50%",
                                                                    backgroundColor: langColor,
                                                                    marginRight: "4px",
                                                                }}
                                                            ></span>
                                                            <p> {repo?.language}</p>
                                                        </div>
                                                        <div className="singleRepoThirdRowStars">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                data-lucide="star"
                                                                className="lucide lucide-star w-3 h-3"
                                                            >
                                                                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                                                            </svg>

                                                            <p>{formatNumber(repo?.stars)}</p>
                                                        </div>
                                                        <div className="singleRepoThirdRowForks">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="12"
                                                                height="12"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                data-lucide="git-fork"
                                                                className="lucide lucide-git-fork w-3 h-3"
                                                            >
                                                                <circle cx="12" cy="18" r="3" />
                                                                <circle cx="6" cy="6" r="3" />
                                                                <circle cx="18" cy="6" r="3" />
                                                                <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                                                                <path d="M12 12v3" />
                                                            </svg>

                                                            <p>{formatNumber(repo?.forks)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="singleRepoThirdRowRight">
                                                        <p>{formatAgo(repo?.createdAt)}</p>
                                                    </div>
                                                </div>

                                            </div>


                                        );
                                    })}
                                    {/* {userData.publicRepos > 12 && (
                                        
                                            <div className="viewMoreBtn">
                                                <span>
                                                    <p>{`${userData.publicRepos-9} More Repos`}</p>
                                                </span>
                                            </div>
                                      
                                    )} */}

                                </section>

                                <section className="graphsContainer">
                                    <div className="graphContainerRow_1">
                                        <div className="ContributionGraphContainer">
                                            <iframe src={`https://github-readme-activity-graph.vercel.app/graph?username=${userData?.userName}&theme=github-compact&area_color=185329&bg_color=4b4b4b&color=ffffff&hide_title=true&hide_border=true `} frameBorder="0"></iframe>
                                        </div>
                                        <div className="ContributionStatsContainer">
                                            <iframe src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData?.userName}&layout=donut&theme=dark&bg_color=4b4b4b&hide_border=true`} frameBorder="0"></iframe>
                                        </div>
                                    </div>
                                    <div className="graphContainerRow_2">

                                        <div className="ContributionStatsContainer">
                                            <iframe src={`https://github-readme-stats.vercel.app/api?username=${userData?.userName}&show_icons=true&theme=dark&bg_color=4b4b4b&hide_border=true&hide_title=true&,prs_merged,prs_merged_percentage`} frameBorder="0"></iframe>
                                        </div>
                                        {/* <div className="Contribution3dGraphContainer">
                                        <iframe src={`https://ssr-contributions-svg.vercel.app/_/${userData?.userName}?chart=3dbar&gap=0.6&scale=3&gradient=true&flatten=0&animation=fall&animation_delay=0.01&weeks=30&theme=green&dark=true`} frameborder="0"></iframe>
                                    </div> */}

                                    </div>


                                </section>
                            </div>
                        </div>
                        {/* </SpotlightCard> */}
                    </>
                )}
            </main>
            {/* Clone for download  */}
        </>
    );
}
