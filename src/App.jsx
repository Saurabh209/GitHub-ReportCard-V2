import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

import UserInfo from './Components/UserInfo';
import RepoDownload from "./Components/RepoDownload";

function App() {

  return (
    
      <div className='MainuserDataContainer'>
        <Routes>
          <Route path="/" element={<UserInfo />} />
          <Route path="/downloadRepo/:user" element={<RepoDownload />} />
        </Routes>
      </div>
   
  )
}

export default App;
