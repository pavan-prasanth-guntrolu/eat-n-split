import React from "react";
import "./index.css";

import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState([...initialFriends]);

  const [selectedUser, setSelectedUser] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((s) => !s);
    setSelectedUser(null);
  }

  function handleSetFriends(friend) {
    setFriends((f) => [...f, friend]);
    setShowAddFriend(false);
  }

  function handleSelect(friend, e) {
    setSelectedUser(friend.name);
    if (e.target.innerText === "Close") {
      setSelectedUser(null);
    }
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.name === selectedUser
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <ul>
          {friends.map((friend) => (
            <FriendList
              friend={friend}
              handleSelect={handleSelect}
              key={friend.id}
              selectedUser={selectedUser}
            />
          ))}
        </ul>

        {showAddFriend && <FormAddFriend handleSetFriends={handleSetFriends} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedUser && (
        <FormSplitBill
          selectedUser={selectedUser}
          handleSplitBill={handleSplitBill}
          setSelectedUser={setSelectedUser}
        />
      )}
    </div>
  );
}

function FormSplitBill({ selectedUser, handleSplitBill, setSelectedUser }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [paidBy, setPaidBy] = useState("You");

  const FriendsExpense = bill - yourExpense;

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yourExpense) return;
    handleSplitBill(paidBy === "You" ? yourExpense : -yourExpense);

    setBill("");
    setYourExpense("");
    setSelectedUser(null);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>SPLIT A BILL WITH {selectedUser}</h2>

      <label>💰 bill value:</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👨 Your expense:</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => setYourExpense(Number(e.target.value))}
      />

      <label>👨 {selectedUser} expense:</label>
      <input type="text" value={FriendsExpense} disabled />

      <label>🤑 Who is paying the bill:</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option>You</option>
        <option>{selectedUser}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}

function FriendList({ friend, handleSelect, selectedUser }) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <li>
      <img src={friend.image} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>{`You and ${friend.name} are even`}</p>}
      {friend.balance < 0 && (
        <p className="red">{`You owe ${friend.name} ${Math.abs(
          friend.balance
        )}`}</p>
      )}
      {friend.balance > 0 && (
        <p className="green">{`${friend.name} owe you ${Math.abs(
          friend.balance
        )}`}</p>
      )}
      {
        <Button onClick={(e) => handleSelect(friend, e)}>
          {friend.name === selectedUser ? "Close" : "Select"}
        </Button>
      }
    </li>
  );
}

function FormAddFriend({ handleSetFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("i");
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const friend = {
      name,
      image: `https://i.pravatar.cc/48?u=${id}}`,
      balance: 0,
      id: id,
    };

    handleSetFriends(friend);

    setName("");
    setImage("https://i.pravatar.cc/");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭Friend Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🎆Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}
