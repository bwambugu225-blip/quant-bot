import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBankRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.273 6.617 9.102 5.117c.39.235.625.625.625 1.055 0 .664-.547 1.211-1.25 1.211H7.21C6.548 14 6 13.453 6 12.79c0-.43.234-.821.586-1.056l9.101-5.117c.196-.117.43-.117.586 0m1.68 6.133h6.68L16 7.867 7.328 12.75h6.68c-.156-.273-.195-.586-.195-.937 0-1.172.976-2.188 2.187-2.188 1.172 0 2.188 1.016 2.188 2.188q0 .527-.235.937M16 10.875a.925.925 0 0 0-.937.938c0 .546.39.937.937.937.508 0 .938-.39.938-.937a.95.95 0 0 0-.938-.938M8.5 20.25v-5h1.25v5h3.125v-5h1.25v5h3.75v-5h1.25v5h3.125v-5h1.25v5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-15a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m-.937 2.5h16.875c.312 0 .625.313.625.625a.64.64 0 0 1-.625.625H7.563a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m-.938 2.5h18.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H6.625A.617.617 0 0 1 6 25.875c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneBankRegularIcon);
export default ForwardRef;
