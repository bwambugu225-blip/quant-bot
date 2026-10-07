import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const SocialYoutubeBlackIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#000', fillRule: 'evenodd', d: 'M28.52 5.483a4.01 4.01 0 0 1 2.82 2.82c.686 2.504.66 7.723.66 7.723s0 5.193-.66 7.697a4.01 4.01 0 0 1-2.82 2.82c-2.504.66-12.52.66-12.52.66s-9.99 0-12.52-.686a4.01 4.01 0 0 1-2.821-2.82C0 21.219 0 16 0 16s0-5.193.659-7.697c.369-1.37 1.476-2.478 2.82-2.847C5.984 4.797 16 4.797 16 4.797s10.017 0 12.521.686M21.14 16l-8.33 4.797v-9.594z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(SocialYoutubeBlackIcon);
export default ForwardRef;
