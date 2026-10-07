import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownAZFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.898 24.86c-.234.273-.546.39-.898.39s-.703-.117-.937-.39l-3.438-3.75a1.24 1.24 0 0 1 .078-1.758 1.24 1.24 0 0 1 1.758.078l1.289 1.367V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v11.797l1.25-1.367a1.24 1.24 0 0 1 1.758-.078 1.24 1.24 0 0 1 .078 1.757zM17.25 19c0-.664.547-1.25 1.25-1.25h5c.469 0 .938.313 1.133.781a1.26 1.26 0 0 1-.274 1.367l-2.851 2.852H23.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-5c-.508 0-.977-.273-1.172-.742a1.26 1.26 0 0 1 .274-1.367l2.851-2.891H18.5c-.703 0-1.25-.547-1.25-1.25M21 7.75c.469 0 .898.273 1.094.703l2.5 5 .625 1.25a1.24 1.24 0 0 1-.547 1.68 1.24 1.24 0 0 1-1.68-.547l-.273-.586h-3.477l-.273.586a1.24 1.24 0 0 1-1.68.547 1.24 1.24 0 0 1-.547-1.68l.625-1.25 2.5-5c.195-.43.625-.703 1.133-.703m-.82 5.625h1.601L21 11.813z' })));
const ForwardRef = forwardRef(StandaloneArrowDownAZFillIcon);
export default ForwardRef;
