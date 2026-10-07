import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBellSlashFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm4.984 6.734 5.782 4.493c.898-1.368 2.304-2.383 3.984-2.696V7.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v.781c2.852.547 5 3.086 5 6.094v.742c0 1.836.664 3.633 1.875 5l.273.313c.352.39.43.898.235 1.367 0 0-.04 0-.04.039l3.516 2.773c.43.313.508.899.157 1.29-.313.43-.899.507-1.29.156L3.853 8.18c-.43-.313-.508-.899-.157-1.29.313-.43.899-.507 1.29-.156M19.36 22.75H8.5c-.508 0-.977-.273-1.172-.703a1.26 1.26 0 0 1 .234-1.367l.274-.313a7.6 7.6 0 0 0 1.914-5v-.156zm-1.601 3.047c-.469.469-1.094.703-1.758.703s-1.328-.234-1.797-.703S13.5 24.664 13.5 24h5c0 .664-.273 1.328-.742 1.797' })));
const ForwardRef = forwardRef(StandaloneBellSlashFillIcon);
export default ForwardRef;
