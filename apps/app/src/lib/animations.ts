// Animation utilities for mobile performance optimization
// Use these variants to ensure smooth animations on mobile devices

export type AnimationConfig = {
  duration?: number;
  delay?: number;
  ease?: string | number[];
};

// Check if device is mobile (can be used in component without hooks)
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth < 768 ||
    /iPad|iPhone|iPod|Android/.test(navigator.userAgent)
  );
};

// Create mobile-friendly fade variants
export const createFadeVariants = (config?: AnimationConfig) => {
  const isMobile = isMobileDevice();
  
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.2 : (config?.duration ?? 0.4),
        delay: isMobile ? 0 : (config?.delay ?? 0),
        ease: 'easeOut',
      },
    },
  };
};

// Create mobile-friendly slide up variants
export const createSlideUpVariants = (config?: AnimationConfig) => {
  const isMobile = isMobileDevice();
  
  return {
    hidden: { 
      opacity: 0, 
      y: isMobile ? 10 : 20  // Reduced movement on mobile
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.2 : (config?.duration ?? 0.4),
        delay: isMobile ? 0 : (config?.delay ?? 0),
        ease: 'easeOut',
      },
    },
  };
};

// Create mobile-friendly scale variants
export const createScaleVariants = (config?: AnimationConfig) => {
  const isMobile = isMobileDevice();
  
  return {
    hidden: { 
      opacity: 0, 
      scale: isMobile ? 0.98 : 0.95  // Subtle scale on mobile
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: isMobile ? 0.2 : (config?.duration ?? 0.35),
        delay: isMobile ? 0 : (config?.delay ?? 0),
        ease: 'easeOut',
      },
    },
  };
};

// Viewport config for mobile
export const getViewportConfig = () => {
  const isMobile = isMobileDevice();
  
  return {
    once: true,
    margin: isMobile ? '-50px' : '-80px',  // Trigger animations earlier on mobile
    amount: isMobile ? 0.1 : 0.2,  // Lower threshold on mobile
  };
};

// Transition config for mobile
export const getTransitionConfig = (config?: AnimationConfig) => {
  const isMobile = isMobileDevice();
  
  return {
    duration: isMobile ? 0.2 : (config?.duration ?? 0.4),
    delay: isMobile ? 0 : (config?.delay ?? 0),
    ease: 'easeOut',
  };
};

// Hover/Tap animation config (disabled on mobile for performance)
export const getHoverTapConfig = () => {
  const isMobile = isMobileDevice();
  
  return {
    whileHover: isMobile ? {} : { scale: 1.02 },
    whileTap: { scale: 0.98 },
  };
};

// Stagger config (reduced on mobile)
export const getStaggerConfig = (baseDelay: number = 0.1) => {
  const isMobile = isMobileDevice();
  
  return {
    staggerChildren: isMobile ? 0.03 : baseDelay,
    delayChildren: isMobile ? 0 : 0.1,
  };
};
