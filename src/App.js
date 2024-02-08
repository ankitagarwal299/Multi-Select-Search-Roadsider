import React, { useState, useEffect } from 'react';
import './style.css';

export default function App() {
  const [searchTerm, setSearchterm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsSelected, setSuggestionsSelected] = useState([]);
  const [selected, setSelected] = useState(new Set());

  //https://www.youtube.com/watch?v=AsvybgZTryo&t=34s
  
  useEffect(() => {
    async function fetchusers() {
      if (searchTerm.trim().length == 0) {
        setSuggestions([]);
        return;
      }

      try {
        let res = await fetch(
          `https://dummyjson.com/users/search?q=${searchTerm}`
        );
        let result = await res.json();
        console.log(result.users);
        setSuggestions(result.users);
      } catch (err) {
        console.log(err);
      }
    }

    fetchusers();
  }, [searchTerm]);

  function handleSelection(selectedItem) {
    setSelected(new Set([...Array.from(selected), selectedItem.email]));
    setSuggestionsSelected([...suggestionsSelected, selectedItem]);
  }

  function handleRemoveUser(deleteitem) {
    /** remove from Set and selected user list */
    let updatedSuggestionList = suggestionsSelected.filter(
      (item) => item.id != deleteitem.id
    );

    setSuggestionsSelected(updatedSuggestionList);

    if (selected.size && selected?.has(deleteitem.email)) {
      let newSet = new Set(Array.from(selected));
      newSet.delete(deleteitem.email);

      setSelected(Array.from(newSet));
    }
  }

  const handleKeyDown = (e) => {
    if (
      e.key === 'Backspace' &&
     
      suggestionsSelected.length > 0
    ) {
      const lastUser = suggestionsSelected[suggestionsSelected.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } 
  };

  return (
    <div>
      <h1>Multi Select Search!</h1>
      <p>
        React JS Interview Questions - Frontend Machine Coding Interview
        Experience
      </p>
      <div className="user-search-container">
        {suggestionsSelected.length > 0 &&
          suggestionsSelected.map((item, index) => {
            return (
              <span className="pill" key={index}>
                <img src={item.image} className="search-img" />
                <label htmlFor={item.firstName}> {item.firstName}</label>
                <span onClick={() => handleRemoveUser(item)}>X</span>
              </span>
            );
          })}

        <div className="suggestions-box">
          <input
            type="text"
            className="user-search-input"
            value={searchTerm}
            placeholder="Search User..."
            onChange={(e) => setSearchterm(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="suggestions-option-box">
            {suggestions.length > 0 &&
              suggestions.map((item, index) => {
                if (selected.size && selected?.has(item.email)) {
                  /* Refresh and remove already selected users from search list by maintinaing Set */
                  return <></>;
                }
                return (
                  <span
                    key={index}
                    className="search-row"
                    onClick={() => {
                      handleSelection(item);
                    }}
                  >
                    <img src={item.image} className="search-img" />
                    <span>{item.firstName}</span>
                  </span>
                );
              })}
          </div>
        </div>
      </div>
      <hr />
      Let us know your experience.....
    </div>
  );
}
