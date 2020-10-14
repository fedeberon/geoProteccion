const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];

const getBreakpointFromWidth = ( width ) => {
  return breakpoints[ ( width >= 1920 * 1 ) + ( width >= 1280 * 1 ) + ( width >= 960 * 1 ) + ( width >= 600 * 1 ) ];
}

export {
  getBreakpointFromWidth,
}
