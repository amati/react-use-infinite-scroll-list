import React, { useState, useEffect, useCallback, useRef } from 'react';
import 'intersection-observer';

const defaultLoadingElement = (
  <div
    style={{
      display: 'flex',
      width: '100%',
      padding: '15px 0 0',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30">
      <style>
        {
          '.loading_spinner circle{transform-origin: 15px 15px; animation: animationStroke 1s linear infinite, animationTransform 1s linear infinite}@keyframes animationStroke { 0%, 100% {stroke-dasharray: 0, 80;} 50% {stroke-dasharray: 70, 80;}} @keyframes animationTransform { 0% {transform: rotate(0);} 50% {transform: rotate(320deg);} 100% {transform: rotate(720deg);}}'
        }
      </style>
      <circle
        cx="15"
        cy="15"
        fill="none"
        r="13"
        stroke="#b7b7b7"
        strokeWidth="2"
        strokeLinecap="round"
        transform="rotate(216.57 15 15)">
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 15 15;320 15 15;720 15 15"
          keyTimes="0;0.5;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"></animateTransform>
        <animate
          attributeName="stroke-dasharray"
          calcMode="linear"
          values="0 80; 70 80; 00 80"
          keyTimes="0;0.5;1"
          dur="1"
          begin="0s"
          repeatCount="indefinite"></animate>
      </circle>
    </svg>
  </div>
);

export default ({ init, more, loadingElement = defaultLoadingElement }) => {
  const [endOfList, setEndOfList] = useState(null);
  const [isFetching, setFetching] = useState(false);
  const [isDone, setDone] = useState(false);
  const [isInit, setInit] = useState(false);

  const observer = useRef();
  let currentObserver;

  // init
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetching) {
            setFetching(true);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: '0px 0px 75px',
      },
    );

    async function fetchInitAndStartObserve() {
      const result = await init();
      setInit(true);
      setDone(result.isDone);
    }
    fetchInitAndStartObserve();
  }, []);

  // start observe for fetch more
  useEffect(() => {
    currentObserver = observer.current;
    endOfList && isInit && currentObserver.observe(endOfList);
    return () => {
      endOfList && currentObserver.unobserve(endOfList);
    };
  }, [isInit, endOfList]);

  // fetch more
  useEffect(() => {
    async function fetchMore() {
      const result = await more();
      setDone(result.isDone);
      setFetching(false);
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
          <div id="__INFINITE_SCROLL_BOTTOM__" ref={setEndOfList} />
          {isFetching && !isDone && loadingElement}
        </>
      );
    },
    [isDone, isFetching],
  );

  return { InfiniteScrollList };
};
