import Track from "./Track";

function Tracklist({ tracks, onAdd, onRemove, isRemoval }) {
  return (
    <>
      {tracks.length > 0 && (
        <div className="tracklistParent">
          {tracks.map((track) => (
            <ul>
              <li>
                <Track
                  key={track.id}
                  isRemoval={isRemoval}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  track={track}
                />
              </li>
            </ul>
          ))}
        </div>
      )}
    </>
  );
}

export default Tracklist;
