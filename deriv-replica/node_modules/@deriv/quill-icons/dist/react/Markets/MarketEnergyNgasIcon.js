import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const MarketEnergyNgasIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#2C9AFF', d: 'M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16' }),
    React.createElement("path", { fill: '#fff', d: 'M21.842 16.921c-.64-.93-.967-1.628-1.054-2.79-.066-.868.3-1.87.3-1.87-.453.3-.458.269-.757.515-1.554 1.285-1.96 2.57-2.007 2.736l-.005.019.005-.019s1.214-4.751-2.167-6.964C15.877 8.365 15.23 8 15.23 8s1.678 4.115-1.327 6.557c-.592-2.415-3.715-2.444-3.715-2.444s.24.84.279 1.04c.506 2.624-1.046 3.454-1.36 5.935.035-.285.021-.172 0 .001l-.001.002v.001c-.246 1.948.682 3.456 2.108 4.473.066-.687.348-1.369.74-1.938.443-.643.669-1.126.729-1.93.045-.6-.207-1.294-.207-1.294.312.209.316.187.522.357.874.722 1.223 1.444 1.34 1.752l.013-.008c-.149-.672-.569-3.292 1.535-4.669.194-.127.642-.379.642-.379s-1.192 2.605 1.431 4.72c-.058-.865.272-1.665.89-2.28.336-.335.941-.496.941-.496s-.166.583-.193.72c-.35 1.816 1.174 3.227.849 4.947a5 5 0 0 1-.27.933h.145c.773-.413 1.49-.95 1.982-1.686 1.118-1.677.615-3.83-.461-5.393' })));
const ForwardRef = forwardRef(MarketEnergyNgasIcon);
export default ForwardRef;
