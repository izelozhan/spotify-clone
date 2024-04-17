import { useEffect, useState } from "react";
import "./App.css";
import Playlist from "./Playlist";
import SearchBar from "./SearchBar";
import Tracklist from "./Tracklist";
import UsersPlaylists from "./UserPlaylists";

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [searchResults, setSearchResults] = useState([]); //search results / array
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
      fetch("http://localhost:3001/callback?code=" + string).then((res) => {
        res.json().then((actual_data) => {
          if (actual_data.access_token) {
            setSpotifyToken(actual_data);
            localStorage.setItem("token", actual_data.access_token);
            window.location.href = "/";
          }
        });
      });
    } else {
      let token = localStorage.getItem("token");
      if (token) {
        setSpotifyToken(token);
        getUserPlaylist()
          .then(() => {})
          .catch(() => {});
      }
    }
  }, []);

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

  const addTrackToPlaylist = (track) => {
    const isTrackInPlaylist = playlistTracks.some((t) => t.id === track.id);
    if (!isTrackInPlaylist) {
      setPlaylistTracks([...playlistTracks, track]);
    }
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
    } catch {}
  };

  return (
    <div className="App">
      <div>
        <h1 className="header">Jammming</h1>
        <SearchBar search={search} />
      </div>

      <div className="trackComponents">
        <Tracklist
          tracks={searchResults}
          onAdd={addTrackToPlaylist}
          isRemoval={false}
        />

        <Playlist
          onRemove={removeTrackToPlaylist}
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          setPlaylistName={setPlaylistName}
          updatePlaylistTracks={updatePlaylistTracks}
          savePlaylistToSpotify={savePlaylistToSpotify}
        />

        <div className="playlistList">
          <UsersPlaylists playlists={userPlaylists} />
          {console.log(playlistTracks)}
        </div>

        
      </div>
    </div>
  );
}

export default App;
