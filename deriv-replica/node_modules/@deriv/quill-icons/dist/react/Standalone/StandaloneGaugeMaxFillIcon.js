import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneGaugeMaxFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m11.25-6.25C17.25 9.586 16.664 9 16 9c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25M16 22.75c1.367 0 2.5-1.094 2.5-2.5 0-.117-.04-.273-.04-.39l4.571-2.852c.43-.274.586-.86.313-1.29-.274-.429-.86-.585-1.29-.312l-4.609 2.852A2.32 2.32 0 0 0 16 17.75a2.49 2.49 0 0 0-2.5 2.5c0 1.406 1.094 2.5 2.5 2.5m-3.125-10.625c0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25M9.75 17.75c.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25m11.875-5.625c0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneGaugeMaxFillIcon);
export default ForwardRef;
