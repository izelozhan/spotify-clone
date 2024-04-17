function Track({ track, onAdd, onRemove, isRemoval }) {
  if (!track) return null;

  return (
    <>
      <div className="trackParent">
        <div className="trackDetails">
          <h4>{track.name}</h4>
          <p>
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
              Add
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Track;
