import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSquareListBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 9.625a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625v-12.5c0-.312-.312-.625-.625-.625zm-2.5.625c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm3.75 2.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25m4.063 0c0-.508.39-.937.937-.937h3.75a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938H16c-.547 0-.937-.391-.937-.938m0 3.75c0-.508.39-.937.937-.937h3.75a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938H16c-.547 0-.937-.391-.937-.938m0 3.75c0-.508.39-.937.937-.937h3.75a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938H16c-.547 0-.937-.391-.937-.938m-2.813-2.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25M11 20.25c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneSquareListBoldIcon);
export default ForwardRef;
