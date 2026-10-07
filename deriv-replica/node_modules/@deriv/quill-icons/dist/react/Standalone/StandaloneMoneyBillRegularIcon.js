import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMoneyBillRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 10.25c0 1.406 1.094 2.5 2.5 2.5V11.5c0-.664-.586-1.25-1.25-1.25zm-1.25 0H9.75C9.75 12.32 8.07 14 6 14v5c2.07 0 3.75 1.68 3.75 3.75h12.5c0-2.07 1.68-3.75 3.75-3.75v-5c-2.07 0-3.75-1.68-3.75-3.75M6 21.5c0 .703.547 1.25 1.25 1.25H8.5c0-1.367-1.133-2.5-2.5-2.5zm20-1.25a2.49 2.49 0 0 0-2.5 2.5h1.25c.664 0 1.25-.547 1.25-1.25zm-18.75-10c-.703 0-1.25.586-1.25 1.25v1.25c1.367 0 2.5-1.094 2.5-2.5zm-2.5 1.25c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5zm13.75 5c0-.86-.508-1.68-1.25-2.148-.781-.43-1.758-.43-2.5 0-.781.468-1.25 1.289-1.25 2.148a2.54 2.54 0 0 0 1.25 2.188c.742.43 1.719.43 2.5 0 .742-.47 1.25-1.29 1.25-2.188m-6.25 0c0-1.328.703-2.54 1.875-3.242 1.133-.664 2.578-.664 3.75 0 1.133.703 1.875 1.914 1.875 3.242 0 1.367-.742 2.578-1.875 3.281-1.172.664-2.617.664-3.75 0-1.172-.703-1.875-1.914-1.875-3.281' })));
const ForwardRef = forwardRef(StandaloneMoneyBillRegularIcon);
export default ForwardRef;
