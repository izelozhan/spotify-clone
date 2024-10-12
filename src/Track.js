import { IoMdAdd } from "react-icons/io";

function Track({ track, onAdd, onRemove, isRemoval }) {
  if (!track) return null;

  return (
    <>
      <div className="trackParent">
        <div className="trackDetails">
          <div className="trackName">
            {track.name}
          </div>
          <p className="trackArtist" style={{fontSize: '12px'}}>
            {track.album?.artists?.at(0)?.name} - {track.album.name}
          </p>
        </div>

        <div className="trackButtons">
          {isRemoval ? (
            <button className="removeButton" onClick={() => onRemove(track)}>
              Remove
            </button>
          ) : (
            <button className="addButton" onClick={() => onAdd(track)}>
              <div className="buttonAdd">Add</div>
              <IoMdAdd />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Track;
