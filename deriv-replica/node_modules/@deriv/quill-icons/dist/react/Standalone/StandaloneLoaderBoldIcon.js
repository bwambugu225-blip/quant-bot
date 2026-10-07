import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLoaderBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.938 7.438v3.125c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937V7.437c0-.507.39-.937.937-.937a.95.95 0 0 1 .938.938m0 15v3.125c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937v-3.125c0-.508.39-.938.937-.938a.95.95 0 0 1 .938.938M6 16.5c0-.508.39-.937.938-.937h3.125A.95.95 0 0 1 11 16.5c0 .547-.43.938-.937.938H6.937c-.546 0-.937-.391-.937-.938m15.938-.937h3.125A.95.95 0 0 1 26 16.5c0 .547-.43.938-.937.938h-3.125c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937M23.07 9.43c.352.39.352.976 0 1.328l-2.226 2.226a.97.97 0 0 1-1.328 0 .97.97 0 0 1 0-1.328l2.226-2.226c.352-.352.938-.352 1.328 0M12.445 21.383 10.22 23.57a.856.856 0 0 1-1.29 0 .856.856 0 0 1 0-1.289l2.188-2.226a.97.97 0 0 1 1.328 0c.352.351.352.937 0 1.328M8.93 9.43a.92.92 0 0 1 1.289 0l2.226 2.226a.97.97 0 0 1 0 1.328c-.351.352-.937.352-1.328 0L8.93 10.758c-.39-.352-.39-.938 0-1.328m11.914 10.625 2.226 2.226a.92.92 0 0 1 0 1.29c-.39.39-.976.39-1.328 0l-2.226-2.188a.97.97 0 0 1 0-1.328.97.97 0 0 1 1.328 0' })));
const ForwardRef = forwardRef(StandaloneLoaderBoldIcon);
export default ForwardRef;
