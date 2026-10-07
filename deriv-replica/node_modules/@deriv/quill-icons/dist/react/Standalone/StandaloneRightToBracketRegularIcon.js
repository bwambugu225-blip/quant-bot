import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRightToBracketRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.46 16.578s.04-.039.04-.078l-.04-.04-5.155-4.882a.3.3 0 0 0-.196-.078c-.117 0-.234.117-.234.273V14a.64.64 0 0 1-.625.625H7.563a.31.31 0 0 0-.313.313v3.124c0 .196.117.313.313.313h4.687c.313 0 .625.313.625.625v2.266c0 .117.117.234.234.234.079 0 .157 0 .196-.04zm1.29-.078c0 .39-.156.742-.43 1.016l-5.156 4.843c-.273.274-.664.391-1.055.391-.82 0-1.484-.664-1.484-1.484v-1.641H7.563c-.899 0-1.563-.664-1.563-1.562v-3.125c0-.86.664-1.563 1.563-1.563h4.062v-1.602c0-.82.664-1.523 1.484-1.523.391 0 .782.156 1.055.43l5.156 4.843c.274.274.43.625.43.977m-.625 7.5h3.75c1.016 0 1.875-.82 1.875-1.875v-11.25C24.75 9.859 23.89 9 22.875 9h-3.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h3.75A3.134 3.134 0 0 1 26 10.875v11.25a3.11 3.11 0 0 1-3.125 3.125h-3.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneRightToBracketRegularIcon);
export default ForwardRef;
