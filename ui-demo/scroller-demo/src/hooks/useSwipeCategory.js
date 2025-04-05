import { useRef, useCallback } from 'react';

/**
 * 自定义Hook: 处理类别滑动切换
 * @param {Function} onSwipe - 滑动回调函数，接受方向参数 ('left' | 'right' | 'up' | 'down')
 * @param {Object} options - 配置选项
 * @param {number} options.threshold - 触发滑动的最小距离阈值，默认为50px
 * @param {boolean} options.preventScroll - 是否阻止滑动时页面滚动，默认为true
 * @param {boolean} options.enableVertical - 是否启用垂直滑动，默认为true
 * @param {boolean} options.enableHorizontal - 是否启用水平滑动，默认为true
 * @returns {Object} 包含触摸事件处理函数的对象
 */
const useSwipeCategory = (onSwipe, options = {}) => {
  const { 
    threshold = 50, 
    preventScroll = true,
    enableVertical = true,
    enableHorizontal = true 
  } = options;
  
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const swipeId = useRef(Date.now()).current; // 用于识别不同的滑动实例
  
  // 处理触摸开始事件
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    console.log(`[SwipeLog-${swipeId}] 触摸开始 - 位置: X=${touchStartX.current}, Y=${touchStartY.current}`);
  }, [swipeId]);
  
  // 处理触摸移动事件
  const handleTouchMove = useCallback((e) => {
    if (!touchStartX.current || !onSwipe) {
      console.log(`[SwipeLog-${swipeId}] 触摸移动 - 跳过（初始触摸点未设置或没有回调）`);
      return;
    }
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const diffX = touchStartX.current - touchEndX;
    const diffY = touchStartY.current - touchEndY;
    
    console.log(`[SwipeLog-${swipeId}] 触摸移动 - 当前位置: X=${touchEndX}, Y=${touchEndY}`);
    console.log(`[SwipeLog-${swipeId}] 触摸移动 - 水平移动: ${diffX}px, 垂直移动: ${diffY}px`);
    
    // 判断是水平滑动还是垂直滑动
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    
    // 水平滑动处理
    if (isHorizontalSwipe && enableHorizontal) {
      console.log(`[SwipeLog-${swipeId}] 触摸移动 - 水平滑动优先`);
      
      if (Math.abs(diffX) > threshold) {
        // 防止在处理手势时页面滚动
        if (preventScroll) {
          e.preventDefault();
          console.log(`[SwipeLog-${swipeId}] 触摸移动 - 阻止默认滚动行为`);
        }
        
        const direction = diffX > 0 ? 'left' : 'right';
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 触发滑动! 方向: ${direction}, 距离: ${Math.abs(diffX)}px > 阈值(${threshold}px)`);
        
        onSwipe(direction);
        
        // 重置触摸起始点，防止连续触发
        touchStartX.current = 0;
        touchStartY.current = 0;
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 重置触摸点，防止连续触发`);
      } else {
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 水平滑动距离不足: ${Math.abs(diffX)}px < 阈值(${threshold}px)`);
      }
    } 
    // 垂直滑动处理
    else if (!isHorizontalSwipe && enableVertical) {
      console.log(`[SwipeLog-${swipeId}] 触摸移动 - 垂直滑动优先`);
      
      if (Math.abs(diffY) > threshold) {
        // 防止在处理手势时页面滚动
        if (preventScroll) {
          e.preventDefault();
          console.log(`[SwipeLog-${swipeId}] 触摸移动 - 阻止默认滚动行为`);
        }
        
        const direction = diffY > 0 ? 'up' : 'down';
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 触发滑动! 方向: ${direction}, 距离: ${Math.abs(diffY)}px > 阈值(${threshold}px)`);
        
        onSwipe(direction);
        
        // 重置触摸起始点，防止连续触发
        touchStartX.current = 0;
        touchStartY.current = 0;
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 重置触摸点，防止连续触发`);
      } else {
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 垂直滑动距离不足: ${Math.abs(diffY)}px < 阈值(${threshold}px)`);
      }
    } else {
      console.log(`[SwipeLog-${swipeId}] 触摸移动 - ${isHorizontalSwipe ? '水平' : '垂直'}滑动已禁用，不触发事件`);
    }
  }, [onSwipe, threshold, preventScroll, enableHorizontal, enableVertical, swipeId]);
  
  // 处理触摸结束事件，重置触摸状态
  const handleTouchEnd = useCallback(() => {
    console.log(`[SwipeLog-${swipeId}] 触摸结束 - 最终位置: X=${touchStartX.current}, Y=${touchStartY.current}`);
    touchStartX.current = 0;
    touchStartY.current = 0;
    console.log(`[SwipeLog-${swipeId}] 触摸结束 - 触摸状态已重置`);
  }, [swipeId]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

export default useSwipeCategory; 