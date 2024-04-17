import { useRef } from "react";

function SearchBar({ search }) {
  const searchRef = useRef();
  const handleSearch = () => {
    search(searchRef.current.value);
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <input className="searchBarInput" ref={searchRef} type="text" />
        <button className="searchBarButton" onClick={handleSearch}>Search</button>
      </div>
    </>
  );
}

export default SearchBar;
