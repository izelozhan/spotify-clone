import Tracklist from "./Tracklist";

function Playlist({
  playlistTracks,
  onRemove,
  setPlaylistName,
  playlistName,
  savePlaylistToSpotify,
}) {
  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  return (
    <>
      <div>
        <div className="playlistNameInputParent"> 
          {playlistTracks.length > 0 && (
            <input
              className="playlistNameInput"
              type="text"
              value={playlistName}
              onChange={handleNameChange}
              placeholder="Enter a name for new list!"
            ></input>
          )}
        </div>

        <Tracklist
          tracks={playlistTracks}
          onRemove={onRemove}
          isRemoval={true}
        />
        {playlistTracks.length > 0 && (
          <button className="saveListButton" onClick={savePlaylistToSpotify}>
            Save Playlist To Spotify
          </button>
        )}
      </div>
    </>
  );
}

export default Playlist;
