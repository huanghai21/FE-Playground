import React, { memo } from 'react';
import './index.css';
import useSwipeSwitch from '../../hooks/useSwipeSwitch';

// 使用memo优化子组件
const CategoryItem = memo(({ category, isActive, onClick }) => (
  <div
    className={`category-item ${isActive ? 'active' : ''}`}
    onClick={onClick}
  >
    {category.name}
  </div>
));

const ContentItem = memo(({ item }) => (
  <div className="content-item">
    {item.name}
  </div>
));

const ScrollHint = memo(({ text, position }) => (
  <div className={`scroll-hint ${position}-hint`}>
    {text}
  </div>
));

const CategoryList = ({ categories }) => {
  const {
    activeIndex,
    showTopHint,
    showBottomHint,
    contentRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleSwitch
  } = useSwipeSwitch(0, categories.length, () => {});

  return (
    <div className="category-container">
      {/* 左侧分类区域 */}
      <div className="category-sidebar">
        {categories.map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            isActive={index === activeIndex}
            onClick={() => handleSwitch(index)}
          />
        ))}
      </div>

      {/* 右侧内容区域 */}
      <div
        className="category-content"
        ref={contentRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 顶部提示 */}
        {showTopHint && activeIndex > 0 && (
          <ScrollHint 
            position="top" 
            text={`上滑切换到: ${categories[activeIndex - 1].name}`} 
          />
        )}

        {/* 内容 */}
        <div className="content-wrapper">
          <h2>{categories[activeIndex].name}</h2>
          <div className="content-items">
            {categories[activeIndex].items.map((item) => (
              <ContentItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 底部提示 */}
        {showBottomHint && activeIndex < categories.length - 1 && (
          <ScrollHint 
            position="bottom" 
            text={`下滑切换到: ${categories[activeIndex + 1].name}`} 
          />
        )}
      </div>
    </div>
  );
};

export default memo(CategoryList);