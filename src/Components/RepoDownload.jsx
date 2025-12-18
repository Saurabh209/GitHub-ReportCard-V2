import React, { useEffect, useState } from 'react';
import './RepoDownload.scss'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const RepoDownload = () => {

    const user = useParams()
    // console.log("userName: ", user?.user)

    const [allRepoData, setAllRepoData] = useState()

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await axios.get(
                    `https://api.github.com/users/${user?.user}/repos?sort=updated`
                );
                setAllRepoData(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchRepos();
    }, [user]);

       




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

    function activeAgo(date) {
        const created = new Date(date);
        const now = new Date();

        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const days = diffDays % 365;

        // Status dot

        // Return formatted result
        if (years === 0 && days === 0) return ` Active today`;
        if (years === 0) return `Last Activity ${days}d ago`;
        return `Last Activity  ${years}y ${days}d ago`;
    }

    function activeAgoColor(date) {
        const created = new Date(date);
        const now = new Date();
        const diffMs = now - created;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const days = diffDays % 365;

        let color = "";

        if (diffDays === 0) color = "#00ff88";
        else if (diffDays <= 7) color = "#c6ff00";
        else if (diffDays <= 30) color = "#ffaa00";
        else color = "#ff4040";
        return color
    }

    console.log("repodata: ", allRepoData)
    return (
        <div className="repoDownloadMain">

            <section className="repoContainer">
                {allRepoData?.map((repo, index) => {

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

                                            {repo?.stars &&
                                                <p>{formatNumber(repo?.stars)}</p>
                                            }

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

            </section>
        </div>
    );
};

export default RepoDownload;