// ** React Imports

import {
  CheckSquare,
  CreditCard,
  HelpCircle,
  Mail,
  MessageSquare,
  Power,
  Settings,
  User,
} from "react-feather";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "../../../../utility/apiRequest";
import Avatar from "@components/avatar";
import { Link } from "react-router-dom";
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import { handleLogout } from "@store/authentication";
import { isUserLoggedIn } from "@utils";
import { useDispatch } from "react-redux";

const UserDropdown = () => {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);

  window.addEventListener("userDataChange", () => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  });

  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
    }
  }, []);

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => {
          e.preventDefault();
          console.log(userData);
        }}
      >
        <div className="user-nav d-sm-flex d-none">
          <span
            className="user-name fw-bold"
            style={{ textTransform: "capitalize" }}
          >
            {(userData && userData["fullName"]) || "Admin"}
          </span>
          <span className="user-status" style={{ textTransform: "capitalize" }}>
            {(userData && userData.role) || "Admin"}
          </span>
        </div>
        <Avatar
          img={
            userData?.profileImage
              ? `${API_BASE_URL}/${userData.profileImage}`
              : defaultAvatar
          }
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/pages/account-settings">
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to="/login"
          onClick={() => dispatch(handleLogout())}
        >
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
