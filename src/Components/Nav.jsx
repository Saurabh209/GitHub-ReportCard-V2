import { useState } from "react"

export default function Nav() {
    const [userName, setUserName] = useState(" ")

    const HandleUserFind = () => {
        console.log(userName)
    }
    return (
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
                <input type="text" placeholder=" i.e. Saurabh209" onChange={(e)=>{setUserName(e.target.value)}} />
                <button onClick={HandleUserFind}>Find User</button>
            </div>


            <span
            >
                <div
                    style={{
                        color: "#ff3b3b",
                        cursor: "default",
                        fontWeight: "bold",

                    }}
                // onClick={HandleLogout}
                >
                    some text or something
                </div>


            </span>
        </div>
    )
}