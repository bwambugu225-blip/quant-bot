import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLoaderRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.625 7.125v3.75A.64.64 0 0 1 16 11.5a.617.617 0 0 1-.625-.625v-3.75c0-.312.273-.625.625-.625.313 0 .625.313.625.625m0 15v3.75A.64.64 0 0 1 16 26.5a.617.617 0 0 1-.625-.625v-3.75c0-.312.273-.625.625-.625.313 0 .625.313.625.625M6 16.5c0-.312.273-.625.625-.625h3.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-3.75A.617.617 0 0 1 6 16.5m15.625-.625h3.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-3.75A.617.617 0 0 1 21 16.5c0-.312.273-.625.625-.625M23.07 9.43c.235.273.235.664 0 .898l-2.656 2.656c-.273.235-.664.235-.898 0-.235-.234-.235-.625 0-.898l2.656-2.656c.234-.235.625-.235.898 0M12.445 20.953 9.79 23.57a.553.553 0 0 1-.86 0 .553.553 0 0 1 0-.86l2.618-2.655c.273-.235.664-.235.898 0 .235.234.235.625 0 .898M8.93 9.43a.613.613 0 0 1 .86 0l2.655 2.656c.235.273.235.664 0 .898-.234.235-.625.235-.898 0L8.93 10.328c-.274-.234-.274-.625 0-.898m11.484 10.625 2.656 2.656a.613.613 0 0 1 0 .86c-.273.273-.664.273-.898 0l-2.656-2.618c-.235-.273-.235-.664 0-.898.234-.235.625-.235.898 0' })));
const ForwardRef = forwardRef(StandaloneLoaderRegularIcon);
export default ForwardRef;
