import React from 'react';
import CategoryList from './components/CategoryList';

const App = () => {
  const categories = [
    {
      id: 1,
      name: '分类1',
      items: Array(20).fill(0).map((_, i) => ({ id: `1-${i}`, name: `项目1-${i}` }))
    },
    {
      id: 2,
      name: '分类2',
      items: Array(15).fill(0).map((_, i) => ({ id: `2-${i}`, name: `项目2-${i}` }))
    },
    {
      id: 3,
      name: '分类3',
      items: Array(25).fill(0).map((_, i) => ({ id: `3-${i}`, name: `项目3-${i}` }))
    },
    // 可以添加更多分类...
  ];

  return (
    <div className="App">
      <h1>分类列表</h1>
      <CategoryList categories={categories} />
    </div>
  );
};

export default App;