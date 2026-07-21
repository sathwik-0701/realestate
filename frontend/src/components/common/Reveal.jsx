import React, { useEffect, useRef, useState } from 'react';


const Reveal = ({
  children,
  delay = 0,
  duration = 0.7,
  distance = 36,
  direction = 'up',
  scale = false,
  as: Tag = 'div',
  once = true,
  threshold = 0.15,
  style = {},
  className = '',
  ...rest
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(node);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const getTransform = () => {
    if (visible) return 'translate(0, 0) scale(1)';
    switch (direction) {
      case 'down':
        return `translate(0, -${distance}px)${scale ? ' scale(0.94)' : ''}`;
      case 'left':
        return `translate(${distance}px, 0)${scale ? ' scale(0.94)' : ''}`;
      case 'right':
        return `translate(-${distance}px, 0)${scale ? ' scale(0.94)' : ''}`;
      case 'up':
      default:
        return `translate(0, ${distance}px)${scale ? ' scale(0.94)' : ''}`;
    }
  };

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform ${duration}s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        willChange: 'opacity, transform',
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
