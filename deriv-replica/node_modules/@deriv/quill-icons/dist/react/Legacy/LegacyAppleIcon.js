import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAppleIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 17', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M11.124.001c.097.947-.271 1.874-.814 2.564-.562.67-1.453 1.203-2.344 1.124-.117-.907.33-1.872.833-2.464C9.36.534 10.33.04 11.124 0M9.032 4.337c.58-.232 1.295-.519 2.083-.471.502.04 1.951.197 2.88 1.592l-.03.02c-.239.159-1.69 1.124-1.671 3.029.018 2.269 1.838 3.119 2.08 3.231l.026.013-.005.017c-.046.15-.36 1.18-1.077 2.245-.657.984-1.333 1.947-2.416 1.967-.51.01-.853-.14-1.211-.296-.375-.163-.765-.333-1.378-.333-.643 0-1.053.175-1.446.344-.34.146-.668.287-1.125.305-1.044.039-1.835-1.043-2.493-2.026C1.896 11.988.872 8.369 2.264 5.93 2.94 4.71 4.177 3.944 5.51 3.924c.582-.01 1.139.213 1.625.409.37.148.698.28.965.28.243 0 .559-.127.932-.276', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyAppleIcon);
export default ForwardRef;
