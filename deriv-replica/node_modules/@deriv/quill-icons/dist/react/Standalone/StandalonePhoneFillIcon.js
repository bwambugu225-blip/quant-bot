import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePhoneFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm12.406 7.477 1.563 3.75c.273.625.117 1.367-.43 1.796l-1.914 1.602a13.12 13.12 0 0 0 6.25 6.25l1.602-1.914c.43-.547 1.171-.703 1.796-.43l3.75 1.563c.743.273 1.094 1.093.899 1.836l-.938 3.437c-.195.664-.78 1.133-1.484 1.133C13.813 26.5 6 18.688 6 9c0-.703.469-1.29 1.133-1.484l3.437-.938c.742-.195 1.563.156 1.836.899' })));
const ForwardRef = forwardRef(StandalonePhoneFillIcon);
export default ForwardRef;
