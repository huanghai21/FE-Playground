import React from 'react';
import './Sidebar.css';
import useScrollToActive from '../hooks/useScrollToActive';

function Sidebar({ categories, activeCategory, onCategoryClick }) {
  // 使用自定义Hook处理滚动到激活项
  const { containerRef } = useScrollToActive(activeCategory, {
    activeSelector: '.sidebar-item.active'
  });

  return (
    <div className="sidebar" ref={containerRef}>
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
