import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTableLayoutRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 9h-15c-.703 0-1.25.586-1.25 1.25v2.5h17.5v-2.5c0-.664-.586-1.25-1.25-1.25M7.25 22.75c0 .703.547 1.25 1.25 1.25h3.75V14h-5zM13.5 24h10c.664 0 1.25-.547 1.25-1.25V14H13.5zm-5-16.25h15c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneTableLayoutRegularIcon);
export default ForwardRef;
