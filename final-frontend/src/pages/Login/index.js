import { useContext } from "react";
import { signInWithPopup } from "firebase/auth";
import GoogleButton from "react-google-button";
import { auth, authProvider } from "../../firebase";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../context/store";
import { createWatchlist } from "../../functions/watchlist";
import "./style.css";

/**
 * Render login page where the user can sign in using a Google account
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/watchlist";
  const { user, setError } = useContext(AppContext);

  return (
    <div>
      <h1 className="text-center">Welcome to My Movie Database App</h1>
      <h3 className="top-buffer text-center">
        See the top 250 movies, search for movies, and manage your own watch
        list!
      </h3>
      {user && (
        <p className="text-center top-buffer">
          You are already signed in as {user.displayName}.
        </p>
      )}
      {!user && (
        <div>
          <GoogleButton
            className="top-buffer mx-auto"
            onClick={async () => {
              try {
                await signInWithPopup(auth, authProvider);
                await createWatchlist(auth.currentUser);
                navigate(from, { replace: true });
              } catch (err) {
                console.log(err);
                setError("Oops, log in failed. Please try again.");
                await auth.signOut();
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Login;
