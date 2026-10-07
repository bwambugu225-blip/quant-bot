import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagArubaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#3D87E0', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#FAD800', fillRule: 'evenodd', d: 'M0 10h24v1H0zm0 2h24v1H0z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', d: 'm4.72 3.28 1.555.491a.24.24 0 0 1 0 .458L4.72 4.72l-.491 1.555a.24.24 0 0 1-.458 0L3.28 4.72l-1.555-.491a.24.24 0 0 1 0-.458L3.28 3.28l.491-1.555a.24.24 0 0 1 .458 0z' }),
    React.createElement("path", { fill: '#D4062F', d: 'm4.48 3.52 1.454.364c.122.03.122.202 0 .232L4.48 4.48l-.364 1.454c-.03.122-.202.122-.232 0L3.52 4.48l-1.454-.364c-.122-.03-.122-.202 0-.232L3.52 3.52l.364-1.454c.03-.122.202-.122.232 0z' })));
const ForwardRef = forwardRef(FlagArubaIcon);
export default ForwardRef;
