import { FaStar } from "react-icons/fa6";

function UsersPlaylists({ playlists }) {
  console.log(playlists);
  const starColors = ["rgb(238, 174, 202)", "rgba(148, 187, 233, 1)", "#DEAAFF"];

  return (
    <div className="usersPlaylist">
      <div className="playlistTitle">Playlists</div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {playlists.items.map((p, index) => (
          <li key={p.id} className="playlistName" style={{ display: "flex", alignItems: "center", marginBottom: "14px" }}>
            <FaStar
              className="start"
              style={{
                marginRight: "16px",
                color: starColors[index % starColors.length],
              }}
            />
            {p.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersPlaylists;
