import "./SideBar.css";
import {
    LineStyle,

} from "@mui/icons-material";
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import GradeIcon from '@mui/icons-material/Grade';
import { Link } from "react-router-dom";
import React from "react";

const SideBar = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="sidebar">
            <div className="sidebarWrapper">
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Dashboard</h3>

                    <ul className="sidebarList">
                        <Link to="/" className="link">
                            <li className="sidebarListItem active">
                                <LineStyle className="sidebarIcon" />
                                Home
                            </li>
                        </Link>
                    </ul>
                </div>
                <div className="sidebarMenu">
                    <h3 className="sidebarTitle">Menu</h3>
                    <ul className="sidebarList">
                        <Link to="/courses" className="link">
                            <li className="sidebarListItem ">
                                <LocalLibraryIcon className="sidebarIcon" />
                                Courses
                            </li>
                        </Link>
                        <Link to="/competencies" className="link">
                            <li className="sidebarListItem ">
                                <EmojiEventsIcon className="sidebarIcon" />
                                Competencies
                            </li>
                        </Link>
                        <Link to="/badges" className="link">
                            <li className="sidebarListItem">
                                <MilitaryTechIcon className="sidebarIcon" />
                                Badges
                            </li>
                        </Link>
                        <Link to="/grades" className="link">
                            <li className="sidebarListItem">
                                <GradeIcon className="sidebarIcon" />
                                Grades
                            </li>
                        </Link>


                    </ul>
                </div>

            </div>
        </div>
    );
};

export default SideBar;
