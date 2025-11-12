/**
 * Animation Specifications
 * Based on tranzo_design_system_doc.md
 */

// Animation Durations (in milliseconds)
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Easing Functions
export const easing = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

// Common Animation Configs (React Native Reanimated)
export const animations = {
  fadeIn: {
    duration: durations.normal,
    easing: easing.easeOut,
  },
  fadeOut: {
    duration: durations.normal,
    easing: easing.easeIn,
  },
  slideUp: {
    duration: durations.normal,
    easing: easing.easeOut,
  },
  slideDown: {
    duration: durations.normal,
    easing: easing.easeIn,
  },
  scaleUp: {
    duration: durations.fast,
    easing: easing.easeOut,
  },
  scaleDown: {
    duration: durations.fast,
    easing: easing.easeIn,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

// Specific Component Animations
export const componentAnimations = {
  balanceReveal: {
    duration: durations.normal,
    easing: easing.easeOut,
  },
  chartLoad: {
    duration: durations.slow,
    easing: easing.easeInOut,
  },
  modalEntry: {
    duration: durations.normal,
    easing: easing.easeOut,
  },
  listItem: {
    duration: durations.fast,
    easing: easing.easeOut,
  },
  buttonPress: {
    duration: durations.fast,
    easing: easing.easeInOut,
  },
};

export default {
  durations,
  easing,
  animations,
  componentAnimations,
};
