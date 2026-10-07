import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRectangleAdRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9C6.547 9 6 9.586 6 10.25v12.5c0 .703.547 1.25 1.25 1.25h17.5c.664 0 1.25-.547 1.25-1.25v-12.5C26 9.586 25.414 9 24.75 9zm-2.5 1.25c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5zm8.36 2.89 2.812 6.25c.156.313 0 .665-.313.82-.312.157-.664 0-.82-.312L14.4 19h-3.711l-.391.898c-.156.313-.508.47-.82.313-.313-.156-.47-.508-.313-.82l2.813-6.25a.59.59 0 0 1 .546-.391c.274 0 .47.156.586.39m-.547 1.758-1.29 2.852h2.54zm6.874.977c-.585 0-1.093.313-1.367.781-.273.508-.273 1.094 0 1.563.274.508.782.781 1.367.781.547 0 1.055-.273 1.329-.781.273-.469.273-1.055 0-1.563a1.56 1.56 0 0 0-1.328-.781M21 15.133v-1.758c0-.312.273-.625.625-.625.313 0 .625.313.625.625v6.25a.64.64 0 0 1-.625.625.63.63 0 0 1-.625-.469 2.73 2.73 0 0 1-1.562.469 2.8 2.8 0 0 1-2.813-2.812 2.826 2.826 0 0 1 2.813-2.813c.546 0 1.093.195 1.562.508' })));
const ForwardRef = forwardRef(StandaloneRectangleAdRegularIcon);
export default ForwardRef;
