import Track from "./Track";

function SearchResults({ tracks, onAdd }) {
  return (
    <>
      <div className="resultsParent">
        
        <ul>
          {tracks.map((track) => (
            <li key={track.id}>
              <Track onAdd={onAdd} track={track} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SearchResults;
