import React from 'react';
import './Sidebar.css';

function Sidebar({ categories, activeCategory, onCategoryClick }) {
  return (
    <div className="sidebar">
      {categories.map(category => (
        <div 
          key={category.id}
          className={`sidebar-item ${category.id === activeCategory ? 'active' : ''}`}
          onClick={() => onCategoryClick(category.id)}
        >
          {category.name}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
