import { useRef, useState } from 'react';

function useDragScroll() {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  function handleMouseDown(e) {
    setIsDragging(true);
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeftStart.current = ref.current.scrollLeft;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeftStart.current - walk;
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
}

export default useDragScroll;