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
  const touchCurrentX = useRef(0);
  const touchCurrentY = useRef(0);
  const swipeId = useRef(Date.now()).current; // 用于识别不同的滑动实例
  
  // 处理触摸开始事件
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    // 初始化当前位置与起始位置相同
    touchCurrentX.current = touchStartX.current;
    touchCurrentY.current = touchStartY.current;
    console.log(`[SwipeLog-${swipeId}] 触摸开始 - 位置: X=${touchStartX.current}, Y=${touchStartY.current}`);
  }, [swipeId]);
  
  // 处理触摸移动事件 - 只记录位置，不触发切换
  const handleTouchMove = useCallback((e) => {
    if (!touchStartX.current) {
      console.log(`[SwipeLog-${swipeId}] 触摸移动 - 跳过（初始触摸点未设置）`);
      return;
    }
    
    // 更新当前触摸位置
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
    
    const diffX = touchStartX.current - touchCurrentX.current;
    const diffY = touchStartY.current - touchCurrentY.current;
    
    console.log(`[SwipeLog-${swipeId}] 触摸移动 - 当前位置: X=${touchCurrentX.current}, Y=${touchCurrentY.current}`);
    console.log(`[SwipeLog-${swipeId}] 触摸移动 - 水平移动: ${diffX}px, 垂直移动: ${diffY}px`);
    
    // 判断是水平滑动还是垂直滑动
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    
    // 如果是有效的滑动手势且需要阻止页面滚动
    if ((isHorizontalSwipe && enableHorizontal && Math.abs(diffX) > threshold) || 
        (!isHorizontalSwipe && enableVertical && Math.abs(diffY) > threshold)) {
      if (preventScroll) {
        e.preventDefault();
        console.log(`[SwipeLog-${swipeId}] 触摸移动 - 阻止默认滚动行为`);
      }
    }
  }, [threshold, preventScroll, enableHorizontal, enableVertical, swipeId]);
  
  // 处理触摸结束事件，在这里执行切换逻辑
  const handleTouchEnd = useCallback(() => {
    console.log(`[SwipeLog-${swipeId}] 触摸结束 - 起始位置: X=${touchStartX.current}, Y=${touchStartY.current}`);
    console.log(`[SwipeLog-${swipeId}] 触摸结束 - 最终位置: X=${touchCurrentX.current}, Y=${touchCurrentY.current}`);
    
    // 确保有起始点和回调函数
    if (!touchStartX.current || !onSwipe) {
      console.log(`[SwipeLog-${swipeId}] 触摸结束 - 跳过（初始触摸点未设置或没有回调）`);
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchCurrentX.current = 0;
      touchCurrentY.current = 0;
      return;
    }
    
    const diffX = touchStartX.current - touchCurrentX.current;
    const diffY = touchStartY.current - touchCurrentY.current;
    
    // 判断是水平滑动还是垂直滑动
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    
    // 水平滑动处理
    if (isHorizontalSwipe && enableHorizontal) {
      console.log(`[SwipeLog-${swipeId}] 触摸结束 - 水平滑动优先`);
      
      if (Math.abs(diffX) > threshold) {
        const direction = diffX > 0 ? 'left' : 'right';
        console.log(`[SwipeLog-${swipeId}] 触摸结束 - 触发滑动! 方向: ${direction}, 距离: ${Math.abs(diffX)}px > 阈值(${threshold}px)`);
        
        onSwipe(direction);
      } else {
        console.log(`[SwipeLog-${swipeId}] 触摸结束 - 水平滑动距离不足: ${Math.abs(diffX)}px < 阈值(${threshold}px)`);
      }
    } 
    // 垂直滑动处理
    else if (!isHorizontalSwipe && enableVertical) {
      console.log(`[SwipeLog-${swipeId}] 触摸结束 - 垂直滑动优先`);
      
      if (Math.abs(diffY) > threshold) {
        const direction = diffY > 0 ? 'up' : 'down';
        console.log(`[SwipeLog-${swipeId}] 触摸结束 - 触发滑动! 方向: ${direction}, 距离: ${Math.abs(diffY)}px > 阈值(${threshold}px)`);
        
        onSwipe(direction);
      } else {
        console.log(`[SwipeLog-${swipeId}] 触摸结束 - 垂直滑动距离不足: ${Math.abs(diffY)}px < 阈值(${threshold}px)`);
      }
    } else {
      console.log(`[SwipeLog-${swipeId}] 触摸结束 - ${isHorizontalSwipe ? '水平' : '垂直'}滑动已禁用，不触发事件`);
    }
    
    // 重置触摸状态
    touchStartX.current = 0;
    touchStartY.current = 0;
    touchCurrentX.current = 0;
    touchCurrentY.current = 0;
    console.log(`[SwipeLog-${swipeId}] 触摸结束 - 触摸状态已重置`);
  }, [onSwipe, threshold, enableHorizontal, enableVertical, swipeId]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

export default useSwipeCategory; 