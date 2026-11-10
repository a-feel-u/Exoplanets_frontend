import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

import './BottomNavbar.css';

function BottomNavbar() {
  const location = useLocation();

  const isFeedActive =
    location.pathname === '/' ||
    location.pathname.startsWith('/feed/');

  return (
    <Navbar className="bottom-navbar">
      <Nav className="bottom-navbar-nav">

        {/* Лента */}
        <Nav.Link
          as={NavLink}
          to="/"
          end
          className={`bottom-navbar-link ${isFeedActive ? 'active' : ''}`}
        >
          <img
            src="/main.PNG"
            alt="Лента"
            className="bottom-navbar-image"
          />
        </Nav.Link>

        {/* Добавление */}
        <Nav.Link
          disabled
          className="bottom-navbar-link"
        >
          <img
            src="/plus.PNG"
            alt="Добавление"
            className="bottom-navbar-image"
          />
        </Nav.Link>

        {/* Плитка */}
        <Nav.Link
          as={NavLink}
          to="/grid"
          className="bottom-navbar-link"
        >
          <img
            src="/cards.PNG"
            alt="Плитка"
            className="bottom-navbar-image"
          />
        </Nav.Link>

        {/* Вход */}
        <Nav.Link
          disabled
          className="bottom-navbar-link"
        >
          <img
            src="/user.PNG"
            alt="Вход"
            className="bottom-navbar-image"
          />
        </Nav.Link>

      </Nav>
    </Navbar>
  );
}

export default BottomNavbar;