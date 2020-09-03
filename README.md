# react-use-infinite-scroll-list

React hooks - Infinite scroll list powered by `IntersectionObserver`

## Install

```shell
npm install react-use-infinite-scroll-list
```

## Usage

```js
import useInfiniteScrollList from 'react-use-infinite-scroll-list';

// ...

// hooks initialize
const [items, setItems] = useState([]);
const { InfiniteScrollList } = useInfiniteScrollList({
  init: init,
  more: more,
  loadingElement: <div>Loading...</div>,
});

// initialize : fetch first data
async function init() {
  return new Promise((resolve, reject) => {
    YOUR_API()
      .then((res) => {
        setItems([res.items]);
        resolve({
          isDone: res.isDone,
        });
      })
      .catch((error) => {
        // ...
        reject(error);
      });
  });
}

// fetch : get more data
async function more() {
  return new Promise((resolve, reject) => {
    YOUR_API()
      .then((res) => {
        setItems([...items, res.items]);
        resolve({ isDone: res.isDone });
      })
      .catch((error) => {
        // ...
        reject(error);
      });
  });
}

return (
  <>
    <InfiniteScrollList>
      <YourList items={items} />
    </InfiniteScrollList>
  </>
);
```

### Props

- `init` : a callback function to fetch first-page data. you should return a Promise resolve with `isDone` value.
- `more` : a callback function to fetch more data when scrolling to the end of list. you should return a Promise resolve with `isDone` value.
- `loadingElement` : (optional) JSX Component to display on a bottom of list while executing `more` callback
