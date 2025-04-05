import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import './App.css';

// 分类和内容数据
const categories = [
  {
    id: 'category1',
    name: '分类一',
    content: {
      title: '分类一内容',
      description: [
        '这是分类一的详细内容。',
        [
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
          '可以在这里添加任何与分类一相关的信息。',
        ].join('\n')
      ]
    }
  },
  {
    id: 'category2',
    name: '分类二',
    content: {
      title: '分类二内容',
      description: [
        '这是分类二的详细内容。',
        [
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
          '可以在这里添加任何与分类二相关的信息。',
        ].join('\n')
      ]
    }
  },
  {
    id: 'category3',
    name: '分类三',
    content: {
      title: '分类三内容',
      description: [
        '这是分类三的详细内容。',
        [
          '可以在这里添加任何与分类三相关的信息。',
          '可以在这里添加任何与分类三相关的信息。',
          '可以在这里添加任何与分类三相关的信息。',
          '可以在这里添加任何与分类三相关的信息。',
          '可以在这里添加任何与分类三相关的信息。',
        ].join('\n')
      ]
    }
  },
  {
    id: 'category4',
    name: '分类四',
    content: {
      title: '分类四内容',
      description: [
        '这是分类四的详细内容。',
        [
          '可以在这里添加任何与分类四相关的信息。',
          '可以在这里添加任何与分类四相关的信息。',
          '可以在这里添加任何与分类四相关的信息。',
          '可以在这里添加任何与分类四相关的信息。',
          '可以在这里添加任何与分类四相关的信息。',
        ].join('\n')
      ]
    }
  }
];

function App() {
  console.log('App 组件重新渲染');
  
  // 状态管理：当前选中的分类
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  
  // 记录状态变化
  useEffect(() => {
    console.log(`[App] 激活的分类ID变更为: ${activeCategory}`);
    console.log(`[App] 当前分类名称: ${categories.find(cat => cat.id === activeCategory)?.name}`);
  }, [activeCategory]);

  // 处理分类点击事件
  const handleCategoryClick = useCallback((categoryId) => {
    console.log(`[App] 分类点击: ${categoryId}`);
    setActiveCategory(categoryId);
  }, []);

  // 处理滑动事件
  const handleSwipe = useCallback((direction) => {
    // 查找当前分类的索引
    const currentIndex = categories.findIndex(cat => cat.id === activeCategory);
    console.log(`[App] 滑动事件 - 方向: ${direction}, 当前索引: ${currentIndex}`);
    
    if (currentIndex === -1) {
      console.log(`[App] 滑动事件 - 当前分类未找到，跳过处理`);
      return;
    }

    // 水平滑动处理
    if (direction === 'left' || direction === 'right') {
      // 左滑：下一个分类
      if (direction === 'left' && currentIndex < categories.length - 1) {
        const nextCategoryId = categories[currentIndex + 1].id;
        console.log(`[App] 滑动事件 - 向左滑动，切换到下一个分类: ${nextCategoryId}`);
        setActiveCategory(nextCategoryId);
      }
      // 右滑：上一个分类
      else if (direction === 'right' && currentIndex > 0) {
        const prevCategoryId = categories[currentIndex - 1].id;
        console.log(`[App] 滑动事件 - 向右滑动，切换到上一个分类: ${prevCategoryId}`);
        setActiveCategory(prevCategoryId);
      } else {
        console.log(`[App] 滑动事件 - 已经是${direction === 'left' ? '最后一个' : '第一个'}分类，不执行切换`);
      }
    }
    // 垂直滑动处理
    else if (direction === 'up' || direction === 'down') {
      // 上滑：下一个分类
      if (direction === 'up' && currentIndex < categories.length - 1) {
        const nextCategoryId = categories[currentIndex + 1].id;
        console.log(`[App] 滑动事件 - 向上滑动，切换到下一个分类: ${nextCategoryId}`);
        setActiveCategory(nextCategoryId);
      }
      // 下滑：上一个分类
      else if (direction === 'down' && currentIndex > 0) {
        const prevCategoryId = categories[currentIndex - 1].id;
        console.log(`[App] 滑动事件 - 向下滑动，切换到上一个分类: ${prevCategoryId}`);
        setActiveCategory(prevCategoryId);
      } else {
        console.log(`[App] 滑动事件 - 已经是${direction === 'up' ? '最后一个' : '第一个'}分类，不执行切换`);
      }
    }
  }, [activeCategory]);

  // 获取当前选中分类的内容
  const activeContent = categories.find(cat => cat.id === activeCategory).content;
  console.log(`[App] 渲染内容标题: ${activeContent.title}`);

  return (
    <div className="container">
      {/* 左侧分类栏 */}
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryClick={handleCategoryClick} 
      />
      
      {/* 右侧内容区域 */}
      <ContentArea 
        content={activeContent} 
        onSwipe={handleSwipe}
      />
    </div>
  );
}

export default App;
