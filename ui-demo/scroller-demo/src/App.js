import React, { useState } from 'react';
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
        '可以在这里添加任何与分类一相关的信息。'
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
        '可以在这里添加任何与分类二相关的信息。'
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
        '可以在这里添加任何与分类三相关的信息。'
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
        '可以在这里添加任何与分类四相关的信息。'
      ]
    }
  }
];

function App() {
  // 状态管理：当前选中的分类
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  // 处理分类点击事件
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  // 获取当前选中分类的内容
  const activeContent = categories.find(cat => cat.id === activeCategory).content;

  return (
    <div className="container">
      {/* 左侧分类栏 */}
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryClick={handleCategoryClick} 
      />
      
      {/* 右侧内容区域 */}
      <ContentArea content={activeContent} />
    </div>
  );
}

export default App;
