import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTakeProfitBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.29 13.297v8.437H9.983v-8.437H7.172v-2.031h7.93v2.03zm4.374 8.437V11.266h4.961c.469 0 .938.117 1.328.273s.703.39.977.664c.273.313.508.664.664 1.094a4.74 4.74 0 0 1 0 2.695 2.9 2.9 0 0 1-.664 1.055 3.7 3.7 0 0 1-.977.703c-.39.156-.82.234-1.328.234h-2.656v3.75zm2.305-5.742h2.383c.351 0 .625-.078.78-.273.235-.156.313-.43.313-.781v-.626c0-.351-.078-.624-.312-.78-.156-.196-.43-.274-.781-.274h-2.383z' })));
const ForwardRef = forwardRef(StandaloneTakeProfitBoldIcon);
export default ForwardRef;
