import { Nav, Navbar } from 'react-bootstrap';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { requestError, signOut } from '../../api/auth';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { resetFilters } from '../../slices/filterSlice';
import { clearAuthenticatedUser, finishAuthRequest, startAuthRequest } from '../../slices/userSlice';
import './BottomNavbar.css';

function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.user);

  async function handleSignOut() {
    if (isLoading) return;
    dispatch(startAuthRequest());
    try {
      await signOut();
      dispatch(resetFilters());
      dispatch(clearAuthenticatedUser());
      dispatch(finishAuthRequest(null));
      navigate('/grid');
    } catch (error) {
      dispatch(finishAuthRequest(requestError(error)));
    }
  }

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
          as={NavLink}
          to="/add"
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

        {isAuthenticated ? (
          <Nav.Link as="button" type="button" className="bottom-navbar-link" onClick={handleSignOut}>
            <img src="/logout.PNG" alt="" className="bottom-navbar-image" />
            
          </Nav.Link>
        ) : (
          <Nav.Link as={NavLink} to="/login" className="bottom-navbar-link">
            <img src="/user.PNG" alt="" className="bottom-navbar-image" />
            
          </Nav.Link>
        )}

      </Nav>
    </Navbar>
  );
}

export default BottomNavbar;