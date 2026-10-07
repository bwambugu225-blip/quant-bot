import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBullhornRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 8.258a.319.319 0 0 0-.547-.235L20.766 9c-1.641 1.719-3.75 2.93-6.016 3.438v6.914a11.73 11.73 0 0 1 6.016 3.437l.937.977c.195.195.547.039.547-.235zM13.5 19.156v-6.523c-.234.039-.469.039-.703.078l-1.172.039H8.5c-.703 0-1.25.586-1.25 1.25v3.75c0 .703.547 1.25 1.25 1.25h3.125l1.172.078c.234 0 .469.04.703.078m7.305-11.992c.937-1.016 2.695-.351 2.695 1.094V23.53c0 1.407-1.758 2.11-2.695 1.094l-.938-.977c-1.719-1.796-3.945-2.93-6.367-3.242v3.907c0 1.21-.977 2.187-2.187 2.187h-.626A2.184 2.184 0 0 1 8.5 24.313V20.25a2.47 2.47 0 0 1-2.5-2.5V14c0-1.367 1.094-2.5 2.5-2.5h3.086l1.133-.04a10.6 10.6 0 0 0 7.148-3.32zM9.75 20.25v4.063c0 .546.39.937.938.937h.624c.508 0 .938-.39.938-.937v-4.024l-.664-.039zM25.375 14c.313 0 .625.313.625.625v2.5a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-2.5c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneBullhornRegularIcon);
export default ForwardRef;
