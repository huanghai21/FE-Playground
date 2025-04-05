import { useRef, useCallback } from 'react';

/**
 * 自定义Hook: 处理类别滑动切换
 * @param {Function} ref - 滑动回调函数，接受方向参数 ('left' | 'right' | 'up' | 'down')
 * @param {Function} onSwipe - 滑动回调函数，接受方向参数 ('left' | 'right' | 'up' | 'down')
 * @param {Object} options - 配置选项
 * @param {number} options.threshold - 触发滑动的最小距离阈值，默认为50px
 * @param {boolean} options.preventScroll - 是否阻止滑动时页面滚动，默认为true
 * @param {boolean} options.enableVertical - 是否启用垂直滑动，默认为true
 * @param {boolean} options.enableHorizontal - 是否启用水平滑动，默认为true
 * @returns {Object} 包含触摸事件处理函数的对象
 */
const useSwipeCategory = (ref, onSwipe, options = {}) => {
  const {
    threshold = 50,
    preventScroll = true,
    enableVertical = true,
    enableHorizontal = true
  } = options;

  // 触摸状态引用
  const touchState = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    id: Date.now() // 用于识别不同的滑动实例
  }).current;

  /**
   * 检测滚动容器是否达到边缘（顶部或底部）
   * 当滚动到顶部或底部时调用callback函数并传递相应的位置信息
   * @returns {string|null} 返回边缘位置('top'|'bottom')或null（未到达边缘）
   */
  const onEdge = () => {
    if (!ref.current) return null;
  
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    const tolerance = 1;
  
    if (scrollTop <= tolerance) {
      return 'top'
    } else if (scrollHeight - (scrollTop + clientHeight) <= tolerance) {
      return 'bottom'
    } else {
      return null
    }
  };

  // 记录日志
  const logSwipe = (action, message) => {
    console.log(`[SwipeLog-${touchState.id}] ${action} - ${message}`);
  };

  // 重置触摸状态
  const resetTouchState = useCallback(() => {
    touchState.startX = 0;
    touchState.startY = 0;
    touchState.currentX = 0;
    touchState.currentY = 0;
    logSwipe('触摸结束', '触摸状态已重置');
  }, [touchState]);

  // 计算滑动距离
  const getSwipeDistance = useCallback(() => {
    return {
      x: touchState.startX - touchState.currentX,
      y: touchState.startY - touchState.currentY
    };
  }, [touchState]);

  // 判断滑动方向
  const determineSwipeDirection = useCallback((diffX, diffY) => {
    const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontal) {
      return {
        isHorizontal: true,
        direction: diffX > 0 ? 'left' : 'right'
      };
    } else {
      return {
        isHorizontal: false,
        direction: diffY > 0 ? 'up' : 'down'
      };
    }
  }, []);

  // 检查滑动是否有效
  const isValidSwipe = useCallback((diffX, diffY, swipeType) => {
    const isHorizontal = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontal && swipeType === 'horizontal') {
      return enableHorizontal && Math.abs(diffX) > threshold;
    } else if (!isHorizontal && swipeType === 'vertical') {
      return enableVertical && Math.abs(diffY) > threshold;
    }

    return false;
  }, [enableHorizontal, enableVertical, threshold]);

  // 处理触摸开始事件
  const handleTouchStart = useCallback((e) => {
    const edge = onEdge();
    if (edge === null) {
      logSwipe('触摸开始', '跳过（容器未滚动到边缘）');
      return;
    }

    touchState.startX = e.touches[0].clientX;
    touchState.startY = e.touches[0].clientY;
    touchState.currentX = touchState.startX;
    touchState.currentY = touchState.startY;

    logSwipe('触摸开始', `在${edge}边缘，位置: X=${touchState.startX}, Y=${touchState.startY}`);
  }, [touchState]);

  // 处理触摸移动事件
  const handleTouchMove = useCallback((e) => {
    if (!touchState.startX) {
      logSwipe('触摸移动', '跳过（初始触摸点未设置）');
      return;
    }

    // 更新当前触摸位置
    touchState.currentX = e.touches[0].clientX;
    touchState.currentY = e.touches[0].clientY;

    const { x: diffX, y: diffY } = getSwipeDistance();

    logSwipe('触摸移动', `当前位置: X=${touchState.currentX}, Y=${touchState.currentY}`);
    logSwipe('触摸移动', `水平移动: ${diffX}px, 垂直移动: ${diffY}px`);

    // 阻止页面滚动
    if (preventScroll) {
      const horizontalValid = isValidSwipe(diffX, diffY, 'horizontal');
      const verticalValid = isValidSwipe(diffX, diffY, 'vertical');

      if (horizontalValid || verticalValid) {
        e.preventDefault();
        logSwipe('触摸移动', '阻止默认滚动行为');
      }
    }
  }, [touchState, preventScroll, getSwipeDistance, isValidSwipe]);

  // 处理触摸结束事件
  const handleTouchEnd = useCallback(() => {
    logSwipe('触摸结束', `起始位置: X=${touchState.startX}, Y=${touchState.startY}`);
    logSwipe('触摸结束', `最终位置: X=${touchState.currentX}, Y=${touchState.currentY}`);

    // 确保有起始点和回调函数
    if (!touchState.startX || !onSwipe) {
      logSwipe('触摸结束', '跳过（初始触摸点未设置或没有回调）');
      resetTouchState();
      return;
    }

    const { x: diffX, y: diffY } = getSwipeDistance();
    const { isHorizontal, direction } = determineSwipeDirection(diffX, diffY);

    // 判断是否为有效滑动
    const isValid = isValidSwipe(
      diffX,
      diffY,
      isHorizontal ? 'horizontal' : 'vertical'
    );

    // 处理有效滑动
    if (isValid) {
      const distance = isHorizontal ? Math.abs(diffX) : Math.abs(diffY);
      logSwipe('触摸结束', `触发滑动! 方向: ${direction}, 距离: ${distance}px > 阈值(${threshold}px)`);
      onSwipe(direction);
    } else {
      const swipeType = isHorizontal ? '水平' : '垂直';
      const enabled = (isHorizontal && enableHorizontal) || (!isHorizontal && enableVertical);

      if (!enabled) {
        logSwipe('触摸结束', `${swipeType}滑动已禁用，不触发事件`);
      } else {
        const distance = isHorizontal ? Math.abs(diffX) : Math.abs(diffY);
        logSwipe('触摸结束', `${swipeType}滑动距离不足: ${distance}px < 阈值(${threshold}px)`);
      }
    }

    resetTouchState();
  }, [
    touchState,
    onSwipe,
    getSwipeDistance,
    determineSwipeDirection,
    isValidSwipe,
    resetTouchState,
    threshold,
    enableHorizontal,
    enableVertical
  ]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

export default useSwipeCategory; 