import Track from "./Track";
import { FaStar } from "react-icons/fa6";

function Tracklist({
  tracks,
  onAdd,
  onRemove,
  isRemoval,
  playlistName,
  defaultHeader,
}) {
  const starColors = [
    "rgb(238, 174, 202)",
    "rgba(148, 187, 233, 1)",
    "#DEAAFF",
  ];
  return (
    <>
      {tracks.length > 0 && (
        <div className="playlistList">
          <div className="searchedList">
            <div className="playlistTitle">
              {playlistName ? (
                <div>{playlistName}</div>
              ) : (
                <div>{defaultHeader}</div>
              )}
            </div>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {tracks.map((track, index) => (
                <li
                  key={track.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FaStar
                    style={{
                      marginRight: "16px",
                      color: starColors[index % starColors.length],
                    }}
                  />
                  <Track
                    isRemoval={isRemoval}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    track={track}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Tracklist;
