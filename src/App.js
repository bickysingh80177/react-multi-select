import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pill from "./components/Pill";

function App() {
  const [searchItem, setsearchItem] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserset, setSelectedUserset] = useState(new Set()); // for removing the already selected items in the list
  const [activeItem, setActiveItem] = useState(0); // for selecting the item on up and down arrow
  const [showSuggestions, setShowSuggestions] = useState(false)

  const inputRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    const fetchUsers = (item) => {
      setActiveItem(0);
      if (searchItem.trim() === "") {
        setSuggestions([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${item}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.log(err));
    };
    const getData = setTimeout(() => {
      fetchUsers(searchItem);
    }, 500);

    return () => clearTimeout(getData);
  }, [searchItem]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserset(new Set([...selectedUsers, user.email]));
    setsearchItem("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUser) => selectedUser.id !== user.id
    );

    setSelectedUsers(updatedUsers);

    const updatedEmails = new Set(selectedUserset);
    updatedEmails.delete(user.email);
    setSelectedUsers(updatedUsers);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestions([]);
    } else if (e.key === "ArrowDown" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveItem((prevIdx) =>
        prevIdx < suggestions.users.length - 1 ? prevIdx + 1 : prevIdx
      );
    } else if (e.key === "ArrowUp" && suggestions?.users?.length > 0) {
      e.preventDefault();
      setActiveItem((prevIdx) => (prevIdx > 0 ? prevIdx - 1 : 0));
    } else if (
      e.key === "Enter" &&
      activeItem >= 0 &&
      activeItem < suggestions?.users?.length
    ) {
      handleSelectUser(suggestions.users[activeItem]);
    }
  };

  const setChange = () => {
    const selected = selectedRef?.current?.querySelector(".active");
    if (selected) {
      selected?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const renderSuggestions = () => {
    if(showSuggestions && searchItem && suggestions.users){
      if(suggestions?.users?.length){
        return (
          <ul className="suggestions-list" ref={selectedRef}>
            {suggestions?.users?.map((user, index) => {
              setTimeout(() => {
                setChange();
              }, [50]);
              {return !selectedUserset.has(user.email) && (
                <li
                  key={user.email}
                  className={`${
                    index === activeItem ? "active" : ""
                  } suggestions-item`}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  {user.name}
                </li>
              )
            }
            })}
          </ul>
        )
      }else{
        return <em className="notfound-item"><span>Not Found</span></em>
      }
    }
  }

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {/* Pills */}
        {selectedUsers.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              handleClick={() => handleRemoveUser(user)}
            />
          );
        })}
        {/* input field with search suggestions */}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchItem}
            onChange={(e) => {
              setShowSuggestions(true)
              setsearchItem(e.target.value)
            }}
            placeholder="Search item..."
            onKeyDown={handleKeyDown}
          />
          {/* search suggestions */}
          {renderSuggestions()}
        </div>
      </div>
    </div>
  );
}

export default App;
