function UsersPlaylists({ playlists }) {
  console.log(playlists);
  return (
    <>
      <div className="usersPlaylist">
        <div className="playlistTitle">Playlists</div>

        {playlists.items.map((p) => (
          <ul>
            <li className="playlistName">{p.name}</li>
          </ul>
        ))}
      </div>
    </>
  );
}

export default UsersPlaylists;
