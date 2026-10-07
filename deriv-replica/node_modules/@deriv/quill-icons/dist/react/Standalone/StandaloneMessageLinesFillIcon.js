import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMessageLinesFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 9c0-1.367 1.094-2.5 2.5-2.5h15C24.867 6.5 26 7.633 26 9v11.25c0 1.406-1.133 2.5-2.5 2.5h-5.43l-4.843 3.633c-.196.156-.43.156-.665.078-.195-.117-.312-.313-.312-.586V22.75H8.5a2.47 2.47 0 0 1-2.5-2.5zm5.938 3.125a.925.925 0 0 0-.938.938c0 .546.39.937.938.937h8.124c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938zm0 3.75a.925.925 0 0 0-.938.938c0 .546.39.937.938.937h4.374c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938z' })));
const ForwardRef = forwardRef(StandaloneMessageLinesFillIcon);
export default ForwardRef;
