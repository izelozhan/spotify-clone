function SavePlaylist({ playlistTracks, playlistName, setPlaylistName, savePlaylistToSpotify}) {
  
  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };
  return (
    <>
      {playlistTracks.length > 0 && (
        <div className="playlistNameInputParent">
          <input
            className="playlistNameInput"
            type="text"
            value={playlistName}
            onChange={handleNameChange}
            placeholder="Enter a name for new list!"
          />
          <button className="saveListButton" onClick={savePlaylistToSpotify}>
            Save Playlist To Spotify
          </button>
        </div>
      )}
    </>
  );
}

export default SavePlaylist;
