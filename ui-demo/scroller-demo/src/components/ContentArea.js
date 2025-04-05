import React, { useRef } from 'react';
import './ContentArea.css';
import useSwipeCategory from '../hooks/useSwipeCategory';

function ContentArea({ content, onSwipe }) {
  const contentRef = useRef(null)
  // 使用自定义Hook处理滑动手势
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeCategory(onSwipe, {
    threshold: 50,  // 触发滑动的最小距离
    preventScroll: true, // 防止页面滚动
    enableVertical: true, // 启用垂直滑动
    enableHorizontal: true // 启用水平滑动
  });

  return (
    <div
      ref={contentRef}
      className="content-area"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2>{content.title}</h2>
      {content.description.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}

export default ContentArea;
