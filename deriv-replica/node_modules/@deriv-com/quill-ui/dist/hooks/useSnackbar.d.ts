export declare const useSnackbar: () => {
    queue: import('../components').SnackbarProps[];
    addSnackbar: (props: Omit<import('../components').SnackbarProps, "id" | "isVisible">) => void;
    removeSnackbar: (id: string, onSnackbarRemove?: () => void) => void;
};
