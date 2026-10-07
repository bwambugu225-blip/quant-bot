import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneQuestionFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 12.75c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25 0-2.734 2.227-5 5-5h1.25c2.734 0 5 2.266 5 5v.156c0 1.719-.898 3.281-2.305 4.219l-1.64 1.055c-.274.156-.43.468-.43.78V19c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-.04c0-1.17.586-2.265 1.563-2.89l1.64-1.054c.703-.47 1.172-1.25 1.172-2.11v-.156c0-1.367-1.133-2.5-2.5-2.5h-1.25a2.49 2.49 0 0 0-2.5 2.5M16 25.25c-.586 0-1.094-.273-1.367-.781-.274-.469-.274-1.055 0-1.563A1.58 1.58 0 0 1 16 22.125a1.56 1.56 0 0 1 1.328.781c.274.508.274 1.094 0 1.563A1.48 1.48 0 0 1 16 25.25' })));
const ForwardRef = forwardRef(StandaloneQuestionFillIcon);
export default ForwardRef;
