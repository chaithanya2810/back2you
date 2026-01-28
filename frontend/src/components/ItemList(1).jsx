import React from "react";

export default function ItemList({ items, onAdd, onLogout, onDelete }) {
  // onDelete should be a function passed from App.js to handle item deletion

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const token = localStorage.getItem("token"); // if your API requires auth
      const response = await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        alert("Error deleting item: " + (data.message || response.statusText));
        return;
      }

      alert("Item deleted successfully!");
      onDelete(); // refresh items in parent component
    } catch (error) {
      alert("Error deleting item: " + error.message);
    }
  };

  

  return (
    <div className="item-list">
      <div className="item-list-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Lost & Found Items</h2>
        <div>
          <button onClick={onAdd} style={{ marginRight: "10px" }}>➕ Post Item</button>
          <button onClick={onLogout}>🚪 Go to Login</button>
        </div>
      </div>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "15px",
              background: "#f1f5f9",
              borderRadius: "10px",
              marginBottom: "15px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
              flexWrap: "wrap",
            }}
          >
            {item.imagePath && (
             <img src={`http://localhost:5000${item.imagePath.startsWith('/') ? '' : '/'}${item.imagePath}`} 
             alt={item.title}
             style={{
               maxWidth: "120px",
               maxHeight: "120px",
               borderRadius: "8px",
              objectFit: "cover",
           }}
  />
)}


            <div style={{ flex: 1, minWidth: "200px" }}>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ margin: "5px 0" }}>
                {item.status.toUpperCase()} — <small>{new Date(item.date).toLocaleDateString("en-US")}</small>
              </p>
              {item.description && <p style={{ margin: "5px 0", color: "#555" }}>{item.description}</p>}
              {item.location && item.location.coordinates && item.location.coordinates.length === 2 && (
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#777" }}>
                  Location: {item.location.coordinates[0]}, {item.location.coordinates[1]}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                height: "fit-content",
                alignSelf: "flex-start",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
