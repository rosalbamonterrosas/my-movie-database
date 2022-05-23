import { useContext, useEffect } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { AppContext } from "../../context/store";
import { auth } from "../../firebase";
import "./style.css";

/**
 * Set the layout for entire web app
 */
function Layout() {
  const { user, error, setError } = useContext(AppContext);

  useEffect(() => {
    if (error !== "") {
      alert(error);
      setError("");
    }
  }, [error, setError]);

  return (
    <div>
      <div>
        <Navbar expand="lg" bg="dark" variant="dark">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              Movie Database App
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/top250movies">
                  Top 250 Movies
                </Nav.Link>
                <Nav.Link as={Link} to="/watchlist">
                  Watchlist
                </Nav.Link>
                <Nav.Link as={Link} to="/search">
                  Search
                </Nav.Link>
              </Nav>
              {user && (
                <Nav>
                  <img className="userImg img-fluid rounded-circle" src={user.photoURL} alt="userPhoto" />
                  <Navbar.Text className="px-3">{user.displayName}</Navbar.Text>
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      auth
                        .signOut()
                        .catch((err) => alert(`Logout Error: ${err}`))
                    }
                  >
                    Log Out
                  </Button>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      <div className="container-fluid">
        <p className="text-center">Created by: Rosalba Monterrosas Z23361820</p>
        <br />
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
