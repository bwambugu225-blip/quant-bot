import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTakeProfitRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.25 12.79v8.944h-1.719V12.79H7.406v-1.523h7.93v1.523zm4.766 8.944V11.266h4.492c.976 0 1.719.312 2.265.859.508.586.782 1.367.782 2.305 0 .976-.274 1.718-.782 2.304-.546.586-1.289.86-2.265.86h-2.813v4.14zm1.68-5.625h2.695c.43 0 .78-.117 1.015-.351.235-.235.352-.547.352-.977v-.703c0-.43-.117-.742-.352-.976-.234-.235-.586-.352-1.015-.352h-2.696z' })));
const ForwardRef = forwardRef(StandaloneTakeProfitRegularIcon);
export default ForwardRef;
