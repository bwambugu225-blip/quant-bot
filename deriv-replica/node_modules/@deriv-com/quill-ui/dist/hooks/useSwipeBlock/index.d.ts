interface SwipeBlockType {
    show?: boolean;
    onClose?: () => void;
    shouldCloseOnDrag?: boolean;
    fullHeightOnOpen?: boolean;
}
export declare const useSwipeBlock: ({ show, onClose, shouldCloseOnDrag, fullHeightOnOpen, }: SwipeBlockType) => {
    height: string;
    containerRef: import('react').RefObject<HTMLDivElement>;
    bindHandle: (...args: any[]) => import('@use-gesture/react/dist/declarations/src/types').ReactDOMAttributes;
    isScrolled: boolean;
    isLg: boolean;
};
export {};
