import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Playlist from "./Playlist";
import SearchBar from "./SearchBar";
import Tracklist from "./Tracklist";
import UsersPlaylists from "./UserPlaylists";
import SavePlaylist from "./SavePlaylist";

const API_URL = "http://localhost:3001";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [userPlaylists, setUserPlaylists] = useState({ items: [] });

  useEffect(() => {
    let string = window.location.href;
    if (string.indexOf("code") > -1) {
      string = string.substring(string.indexOf("code"));
      string = string.split("&")[0];
      string = string.split("=")[1];
      console.log(string);
      fetch("http://localhost:3001/callback?code=" + string).then(
        async (res) => {
          try {
            const actual_data = await res.json();
            if (actual_data.access_token) {
              // setSpotifyToken(actual_data);
              const profile = await fetchProfile(actual_data.access_token);
              localStorage.setItem("token", actual_data.access_token);
              localStorage.setItem("userId", profile.id);
              window.location.href = "/";
              await getUserPlaylist();
            }
          } catch {
            throw new Error("Error get user playlist");
          }
        }
      );
    } else {
      let token = localStorage.getItem("token");
      if (token) {
        // setSpotifyToken(token);
        getUserPlaylist()
          .then(() => {})
          .catch(() => {
            localStorage.clear();
            alert("Your session has expired. Please log in again.");
            window.location.href = "/";
          });
      } else {
        fetch(API_URL + "/login").then(async (res) => {
          let data = await res.json();
          let url = data.url;
          window.location.href = url;
        });
      }
    }
  }, []);
  const addTrackToPlaylist = useCallback(
    (track) => {
      const isTrackInPlaylist = playlistTracks.some((t) => t.id === track.id);
      if (!isTrackInPlaylist) {
        setPlaylistTracks([...playlistTracks, track]);
      }
    },
    [playlistTracks]
  );

  async function fetchProfile(token) {
    try {
      const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      return await result.json();
    } catch {
      throw new Error("Failed to get profile.");
    }
  }

  const search = async (text) => {
    let token = localStorage.getItem("token");
    if (!token) {
      console.error("Spotify token is missing.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/search?type=track&q=" +
          encodeURIComponent(text),
        {
          headers: { Authorization: "Bearer " + token },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results.");
      }

      const data = await response.json();
      setSearchResults(data.tracks.items);
      return data;
    } catch (error) {
      console.error("Error searching tracks:", error);
    }
  };

  const updatePlaylistTracks = (tracks) => {
    setPlaylistTracks(tracks);
  };

  const removeTrackToPlaylist = (track) => {
    const updatedPlaylist = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(updatedPlaylist);
  };

  const savePlaylistToSpotify = async () => {
    let token = localStorage.getItem("token");

    const trackURI = playlistTracks.map((t) => t.uri);

    try {
      const userResponse = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error("Failed to get user information from Spotify.");
      }

      const userData = await userResponse.json();
      const userId = userData.id;
      localStorage.setItem("userId", userId);

      console.log("alalala");
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: playlistName,
            description: "Custom playlist",
            public: true,
          }),
        }
      );

      if (!createPlaylistResponse.ok) {
        throw new Error("Failed to create playlist on Spotify.");
      }

      const playlistData = await createPlaylistResponse.json();
      const playlistId = playlistData.id;
      console.log(playlistId);

      // Step 3: Add tracks to the new playlist
      const addTracksResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: trackURI,
          }),
        }
      );

      if (!addTracksResponse.ok) {
        throw new Error("Failed to add tracks to the playlist on Spotify.");
      }

      console.log("Playlist successfully created and tracks added to Spotify.");
    } catch (error) {
      console.error("Error saving playlist to Spotify:", error);
    }
    setPlaylistTracks([]);
    setPlaylistName("");
  };

  const getUserPlaylist = async () => {
    let userId = localStorage.getItem("userId");
    let token = localStorage.getItem("token");
    try {
      const getPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!getPlaylistResponse.ok) {
        throw new Error("Failed");
      }

      const userPlaylist = await getPlaylistResponse.json();
      setUserPlaylists(userPlaylist);
    } catch {
      throw new Error("Token expired");
    }
  };

  return (
    <div className="App">
      <div className="headerParent">
        <h1 className="header">Jammming</h1>
        <SearchBar search={search} />
      </div>
      <div className="saveNewPlaylist">
        <SavePlaylist
          playlistTracks={playlistTracks}
          playlistName={playlistName}
          setPlaylistName={setPlaylistName}
          savePlaylistToSpotify={savePlaylistToSpotify}
        />
      </div>
      <div className="trackComponents">
        <div className="playlistList">
          <UsersPlaylists playlists={userPlaylists} />
        </div>

        <div className="searchResults">
          {searchResults ? (
            <Tracklist
              tracks={searchResults}
              defaultHeader={"Results"}
              onAdd={addTrackToPlaylist}
              isRemoval={false}
            />
          ) : (
            <div>Searching</div>
          )}
        </div>

        <div className="newPlaylist">
          <Playlist
            onRemove={removeTrackToPlaylist}
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            setPlaylistName={setPlaylistName}
            updatePlaylistTracks={updatePlaylistTracks}
            savePlaylistToSpotify={savePlaylistToSpotify}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
