import Tracklist from "./Tracklist";

function Playlist({ playlistTracks, onRemove, playlistName, setPlaylistName }) {
  return (
    <>
      <div>
        <Tracklist
          tracks={playlistTracks}
          onRemove={onRemove}
          isRemoval={true}
          playlistName={playlistName}
        />
      </div>
    </>
  );
}

export default Playlist;
