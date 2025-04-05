import { useEffect, useRef } from 'react';

/**
 * 自定义Hook：当活动项改变时滚动到视图中
 * @param {string} activeId - 当前激活项的ID
 * @param {Object} options - 配置选项
 * @param {string} options.activeSelector - 激活项的CSS选择器，默认为'.active'
 * @param {number} options.offset - 滚动时的额外偏移量，默认为10px
 * @returns {Object} 包含容器引用的对象
 */
const useScrollToActive = (activeId, options = {}) => {
  const { activeSelector = '.active', offset = 10 } = options;
  const containerRef = useRef(null);
  const scrollId = useRef(Date.now()).current; // 唯一标识符
  
  useEffect(() => {
    // 当activeId变化时，确保滚动到激活项
    console.log(`[ScrollLog-${scrollId}] activeId变化: ${activeId}`);
    
    if (!containerRef.current) {
      console.log(`[ScrollLog-${scrollId}] 容器引用不存在，跳过滚动`);
      return;
    }
    
    // 给DOM一点时间来更新
    console.log(`[ScrollLog-${scrollId}] 等待DOM更新...`);
    setTimeout(() => {
      const container = containerRef.current;
      const activeItem = container.querySelector(activeSelector);
      
      if (!activeItem) {
        console.log(`[ScrollLog-${scrollId}] 未找到激活项 "${activeSelector}"，跳过滚动`);
        return;
      }
      
      console.log(`[ScrollLog-${scrollId}] 找到激活项: ${activeItem.textContent || 'unnamed'}`);
      
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      
      console.log(`[ScrollLog-${scrollId}] 容器位置: left=${containerRect.left}, right=${containerRect.right}, top=${containerRect.top}, bottom=${containerRect.bottom}`);
      console.log(`[ScrollLog-${scrollId}] 激活项位置: left=${itemRect.left}, right=${itemRect.right}, top=${itemRect.top}, bottom=${itemRect.bottom}`);
      
      // 检测是移动设备还是桌面设备
      const isMobile = window.innerWidth <= 768;
      console.log(`[ScrollLog-${scrollId}] 设备类型: ${isMobile ? '移动设备' : '桌面设备'}`);
      
      if (isMobile) {
        // 移动端水平滚动
        if (itemRect.left < containerRect.left) {
          const scrollAmount = containerRect.left - itemRect.left + offset;
          console.log(`[ScrollLog-${scrollId}] 向左滚动 ${scrollAmount}px`);
          container.scrollLeft -= scrollAmount;
        } else if (itemRect.right > containerRect.right) {
          const scrollAmount = itemRect.right - containerRect.right + offset;
          console.log(`[ScrollLog-${scrollId}] 向右滚动 ${scrollAmount}px`);
          container.scrollLeft += scrollAmount;
        } else {
          console.log(`[ScrollLog-${scrollId}] 激活项已在可视区域内，无需滚动`);
        }
        console.log(`[ScrollLog-${scrollId}] 最终水平滚动位置: ${container.scrollLeft}px`);
      } else {
        // 桌面端垂直滚动
        if (itemRect.top < containerRect.top) {
          const scrollAmount = containerRect.top - itemRect.top + offset;
          console.log(`[ScrollLog-${scrollId}] 向上滚动 ${scrollAmount}px`);
          container.scrollTop -= scrollAmount;
        } else if (itemRect.bottom > containerRect.bottom) {
          const scrollAmount = itemRect.bottom - containerRect.bottom + offset;
          console.log(`[ScrollLog-${scrollId}] 向下滚动 ${scrollAmount}px`);
          container.scrollTop += scrollAmount;
        } else {
          console.log(`[ScrollLog-${scrollId}] 激活项已在可视区域内，无需滚动`);
        }
        console.log(`[ScrollLog-${scrollId}] 最终垂直滚动位置: ${container.scrollTop}px`);
      }
    }, 10);
  }, [activeId, activeSelector, offset, scrollId]);
  
  return { containerRef };
};

export default useScrollToActive; 