import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar"; 
import {useState} from "react";
import './Dashboard.css'

const Dashboard = () =>
{
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log("Searching for:", query); 
  };

  return (
    <div className="dashboard">
      <SideBar />
      <div className="content">
        <div className="searchbar">
          <SearchBar onSearch={handleSearch} />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
