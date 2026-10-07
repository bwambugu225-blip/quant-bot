import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePlaybackSpeedBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M25.188 16.5c0 4.96-3.711 9.023-8.438 9.61v-1.876c3.71-.586 6.563-3.828 6.563-7.734 0-3.867-2.852-7.11-6.563-7.695V6.89c4.727.625 8.438 4.687 8.438 9.609M10.93 10.172 9.563 8.844A9.86 9.86 0 0 1 14.25 6.89v1.914c-1.25.195-2.383.664-3.32 1.367M9.133 11.93a7.8 7.8 0 0 0-1.367 3.32H5.89c.195-1.719.898-3.32 1.914-4.648zm0 9.14-1.328 1.367c-1.016-1.328-1.72-2.93-1.914-4.687h1.875c.195 1.25.664 2.383 1.367 3.32m1.797 1.797a7.9 7.9 0 0 0 3.32 1.367v1.875c-1.758-.195-3.36-.898-4.687-1.914zm2.226-11.562a.97.97 0 0 1 .977.078l6.25 4.375c.273.156.39.469.39.742 0 .313-.117.625-.39.781l-6.25 4.375a.97.97 0 0 1-.977.078c-.273-.156-.469-.507-.469-.859v-8.75c0-.312.196-.664.47-.82m1.406 2.656v5.117l3.672-2.578z' })));
const ForwardRef = forwardRef(StandalonePlaybackSpeedBoldIcon);
export default ForwardRef;
