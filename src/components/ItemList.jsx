import React from "react";

export default function ItemList({ items, onAdd, onLogout, onDelete }) {
  return (
    <div className="item-list">
      <div className="item-list-header">
        <h2>Lost & Found Items</h2>
        <div>
          <button onClick={onAdd}>➕ Post Item</button>
          <button onClick={onLogout}>🚪 Go to Login</button>
        </div>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', border: '1px solid #ccc', marginBottom: '10px' }}>
            {item.imagePath && (
              <img 
                src={`http://localhost:5000${item.imagePath.startsWith('/') ? '' : '/'}${item.imagePath}`} 
                alt={item.title} 
                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} 
              />
            )}
            <div style={{ flex: 1 }}>
              <strong>{item.title}</strong> — {item.status} ({item.date})
              {item.description && <p>{item.description}</p>}
            </div>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this item?")) {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    alert("You must be logged in to delete items.");
                    return;
                  }
                  fetch(`http://localhost:5000/api/items/${item._id}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: "Bearer " + token,
                    },
                  })
                    .then((r) => {
                      if (!r.ok) {
                        return r.json().then((data) => {
                          throw new Error(data.message || "Failed to delete item");
                        });
                      }
                      return r.json();
                    })
                    .then(() => {
                      alert("Item deleted successfully!");
                      onDelete();
                    })
                    .catch((err) => {
                      console.error("Error deleting item:", err);
                      alert("Error: " + err.message);
                    });
                }
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
