import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartCandlestickFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 9v13.125c0 .352.273.625.625.625H24.75c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H9.125C7.367 25.25 6 23.883 6 22.125V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25m10-.625v1.875c.664 0 1.25.586 1.25 1.25v3.75c0 .703-.586 1.25-1.25 1.25v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V16.5c-.703 0-1.25-.547-1.25-1.25V11.5c0-.664.547-1.25 1.25-1.25V8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625M21 15.25c0-.664.547-1.25 1.25-1.25v-1.875c0-.312.273-.625.625-.625.313 0 .625.313.625.625V14c.664 0 1.25.586 1.25 1.25v2.5c0 .703-.586 1.25-1.25 1.25v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V19c-.703 0-1.25-.547-1.25-1.25zm-8.75-3.75V9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625V11.5c.664 0 1.25.586 1.25 1.25v5c0 .703-.586 1.25-1.25 1.25v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V19c-.703 0-1.25-.547-1.25-1.25v-5c0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneChartCandlestickFillIcon);
export default ForwardRef;
