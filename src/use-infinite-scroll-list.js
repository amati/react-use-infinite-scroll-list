import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'intersection-observer';

const defaultLoadingElement = (
  <>
    <div>...Loading...</div>
  </>
);

export default useInfiniteScrollList = ({ init, more, loadingElement = defaultLoadingElement }) => {
  const [endOfList, setEndOfList] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    async function fetchInit() {
      const result = await init();
      setIsDone(result.isDone);
    }
    fetchInit();
  }, []);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetching) {
            setIsFetching(true);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: '0px 0px 50px',
      },
    ),
  );

  useEffect(() => {
    const currentObserver = observer.current;
    endOfList && currentObserver.observe(endOfList);
    return () => {
      endOfList && currentObserver.unobserve(endOfList);
    };
  }, [endOfList]);

  useEffect(() => {
    async function fetchMore() {
      const result = await more();
      setIsDone(result.isDone);
      setIsFetching(false);
    }
    if (isFetching && !isDone) {
      fetchMore();
    }
  }, [isFetching, isDone]);

  const InfiniteScrollList = useCallback(
    ({ children }) => {
      return (
        <>
          {children}
          <div id="bottom_of_list" ref={setEndOfList} />
          {isFetching && !isDone && loadingElement}
        </>
      );
    },
    [isDone, isFetching],
  );

  return { InfiniteScrollList };
};
