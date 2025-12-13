
import { useState, useEffect } from 'react';

const useCountUp = (end: number, duration = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const progress = Math.min(1, (currentTime - startTime) / duration);
      
      start = Math.floor(progress * end);
      setCount(start);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};

export default useCountUp;
