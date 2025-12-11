
import { useState, useEffect, RefObject, useMemo } from 'react';

const useOnScreen = (ref: RefObject<HTMLElement>, rootMargin = '0px') => {
  const [isIntersecting, setIntersecting] = useState(false);

  const observer = useMemo(() => new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
      }
    },
    { rootMargin }
  ), [rootMargin]);

  useEffect(() => {
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, observer]);

  return isIntersecting;
};

export default useOnScreen;
