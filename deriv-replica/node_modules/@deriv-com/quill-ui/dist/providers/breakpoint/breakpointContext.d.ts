export type BreakpointContextValue = {
    isXs: boolean;
    isSm: boolean;
    isMd: boolean;
    isLg: boolean;
    isXl: boolean;
    is2xl: boolean;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};
export declare const BreakpointContext: import('react').Context<BreakpointContextValue>;
export default BreakpointContext;
