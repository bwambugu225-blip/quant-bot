export declare const DOTS = "...";
type UsePaginationRangeProps = {
    currentPage: number;
    totalPageCount: number;
    variant: "number" | "bullet";
};
export declare const UsePaginationRange: ({ currentPage, totalPageCount, variant, }: UsePaginationRangeProps) => (number | "...")[];
export {};
