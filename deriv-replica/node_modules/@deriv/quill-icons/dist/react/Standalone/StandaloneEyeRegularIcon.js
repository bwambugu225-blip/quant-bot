import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEyeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.32 11.813C7.64 13.375 6.508 15.25 6 16.5c.508 1.25 1.64 3.125 3.32 4.688S13.227 24 16 24c2.734 0 4.96-1.25 6.64-2.812 1.68-1.563 2.813-3.438 3.36-4.688-.547-1.25-1.68-3.125-3.36-4.687S18.735 9 16 9c-2.773 0-5 1.25-6.68 2.813M16 7.75c3.125 0 5.664 1.445 7.5 3.164 1.836 1.68 3.047 3.711 3.633 5.117a1.4 1.4 0 0 1 0 .977c-.586 1.367-1.797 3.398-3.633 5.117S19.125 25.25 16 25.25c-3.164 0-5.703-1.406-7.54-3.125-1.835-1.719-3.046-3.75-3.632-5.117a1.4 1.4 0 0 1 0-.977c.586-1.406 1.797-3.437 3.633-5.117C10.297 9.195 12.836 7.75 16 7.75m-3.75 8.75c0 1.367.703 2.578 1.875 3.281 1.133.664 2.578.664 3.75 0 1.133-.703 1.875-1.914 1.875-3.281 0-1.328-.742-2.54-1.875-3.242-1.172-.664-2.617-.664-3.75 0-1.172.703-1.875 1.914-1.875 3.242m8.75 0c0 1.797-.977 3.438-2.5 4.336-1.562.898-3.477.898-5 0A4.97 4.97 0 0 1 11 16.5c0-1.758.938-3.398 2.5-4.297 1.523-.898 3.438-.898 5 0 1.523.899 2.5 2.54 2.5 4.297' })));
const ForwardRef = forwardRef(StandaloneEyeRegularIcon);
export default ForwardRef;
