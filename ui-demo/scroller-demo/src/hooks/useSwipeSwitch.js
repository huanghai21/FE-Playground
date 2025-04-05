import { useState, useRef, useEffect, useCallback } from 'react';
import { throttle } from 'lodash';

const useSwipeSwitch = (initialIndex, itemCount, onSwitch) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [showTopHint, setShowTopHint] = useState(false);
  const [showBottomHint, setShowBottomHint] = useState(false);
  const contentRef = useRef(null);
  const touchStartY = useRef(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  // 使用useCallback缓存切换函数
  const handleSwitch = useCallback((newIndex) => {
    if (newIndex < 0 || newIndex >= itemCount) return;

    setActiveIndex(newIndex);
    setShowTopHint(false);
    setShowBottomHint(false);
    onSwitch(newIndex);

    // 使用平滑滚动
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [itemCount, onSwitch]);

  // 节流处理滚动事件
  const handleScroll = useCallback(throttle(() => {
    const now = Date.now();
    if (now - lastScrollTime.current < 100 || !contentRef.current || isScrolling.current) return;
    lastScrollTime.current = now;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isAtTop = scrollTop <= 1; // 增加容错值
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) <= 1;

    // 使用函数式更新避免不必要的渲染
    setShowTopHint(prev => isAtTop && activeIndex > 0 ? true : prev ? false : prev);
    setShowBottomHint(prev => isAtBottom && activeIndex < itemCount - 1 ? true : prev ? false : prev);
  }, 100), [activeIndex, itemCount]);

  // 优化触摸事件处理
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    // 只在真正需要阻止默认行为时才阻止
    if (
      (scrollTop <= 1 && deltaY > 0 && showTopHint) ||
      (Math.abs(scrollHeight - clientHeight - scrollTop) <= 1 && deltaY < 0 && showBottomHint)
    ) {
      e.preventDefault();
    }
  }, [showTopHint, showBottomHint]);

  const handleTouchEnd = useCallback((e) => {
    if (!contentRef.current || isScrolling.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    // 增加滑动速度判断
    const velocity = Math.abs(deltaY / (e.timeStamp - touchStartY.current.timeStamp));
    const isFastSwipe = velocity > 0.3;

    if (
      (scrollTop <= 1 && deltaY > 50 && showTopHint && activeIndex > 0) ||
      (isFastSwipe && scrollTop <= 1 && deltaY > 20 && showTopHint && activeIndex > 0)
    ) {
      isScrolling.current = true;
      handleSwitch(activeIndex - 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    } else if (
      (Math.abs(scrollHeight - clientHeight - scrollTop) <= 1 && deltaY < -50 && showBottomHint && activeIndex < itemCount - 1) ||
      (isFastSwipe && Math.abs(scrollHeight - clientHeight - scrollTop) <= 1 && deltaY < -20 && showBottomHint && activeIndex < itemCount - 1)
    ) {
      isScrolling.current = true;
      handleSwitch(activeIndex + 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 300);
    }
  }, [activeIndex, itemCount, showTopHint, showBottomHint, handleSwitch]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // 添加被动事件监听器提高滚动性能
    content.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      content.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    activeIndex,
    showTopHint,
    showBottomHint,
    contentRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleSwitch
  };
};

export default useSwipeSwitch;