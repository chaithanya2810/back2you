import React from "react";

export default function ItemList({ items, onAdd, onLogout }) {
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
            <div>
              <strong>{item.title}</strong> — {item.status} ({item.date})
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
