// ** Dropdowns Imports
import UserDropdown from './UserDropdown'
// import NotificationDropdown from './NotificationDropdown'

// ** Third Party Components
import { Sun, Moon } from 'react-feather'

// ** Reactstrap Imports
import { NavItem, NavLink } from 'reactstrap'

const NavbarUser = props => {
  // ** Props


  return (
    <ul className='nav navbar-nav align-items-center ms-auto'>
      {/* <NotificationDropdown /> */}
      <UserDropdown />
    </ul>
  )
}
export default NavbarUser
