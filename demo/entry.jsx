import React from 'react';
import ReactDOM from 'react-dom';
import { createScrollContainer } from 'react-scroll-view';

import CollectionView from '../src/collection.js';

const items = new Array(10000).fill(undefined).map((item, index) => ({
  index,
}));
const renderItem = (item, index, { key, width, height }) => (
  <div
    style={{
      margin: 10,
      color: 'white',
      flex: 1,
      background: `url(http://placekitten.com/${Math.round(width)}/${Math.round(height)})`,
      border: 'solid 2px blue',
    }}
  >
    Item {item.index} key: {key}
  </div>
);

const Wrapper = createScrollContainer()(({ children }) => (
  <div
    style={{
      position: 'fixed',
      left: 0,
      top: 40,
      right: 0,
      bottom: 0,
      overflowY: 'scroll',
      overflowScrolling: 'touch',
      WebkitOverflowScrolling: 'touch',
    }}
  >
    {children}
  </div>
));

ReactDOM.render(
  <Wrapper>
    <div style={{ height: '300px', background: 'red' }}>
      Some odd sized stuff here which is not part of the list
    </div>
    <CollectionView
      itemStyle={{
        display: 'flex',
        flexDirection: 'column',
      }}
      delayFirstRender
      renderItem={renderItem}
      items={items}
      getHeight={() => `${(Math.random() * 50) + 50}% + 30px`}
      getWidth={() => `${(Math.random() * 40) + 10}%`}
      prerender="100%"
    />,
  </Wrapper>,
  global.document.getElementById('root'),
);
