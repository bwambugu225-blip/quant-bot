import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBankBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.43 6.617 8.867 4.922c.43.234.703.664.703 1.133 0 .742-.625 1.328-1.367 1.328H7.328A1.317 1.317 0 0 1 6 12.672c0-.469.234-.899.664-1.133l8.867-4.922a.92.92 0 0 1 .899 0m-1.524 5.508c-.117-.156-.156-.39-.156-.625 0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .234-.078.469-.195.625h5.468L16 8.531l-6.562 3.594zM8.5 15.25h1.875v6.25h2.5v-6.25h1.875v6.25h2.5v-6.25h1.875v6.25h2.5v-6.25H23.5v6.25h.313a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H8.5c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938zm-1.25 9.375h17.813a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H7.25c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938' })));
const ForwardRef = forwardRef(StandaloneBankBoldIcon);
export default ForwardRef;
