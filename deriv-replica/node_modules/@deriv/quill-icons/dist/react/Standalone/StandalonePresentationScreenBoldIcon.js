import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePresentationScreenBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M5.688 6.5h20.625a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H5.688c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938M6 9.625h1.875v8.438c0 .195.117.312.313.312h15.625a.31.31 0 0 0 .312-.312V9.625H26v8.438c0 1.21-1.016 2.187-2.187 2.187h-6.915v1.836l2.852 2.852c.39.351.39.937 0 1.289-.352.39-.937.39-1.328 0l-2.461-2.461-2.461 2.46a.856.856 0 0 1-1.29 0 .856.856 0 0 1 0-1.288l2.852-2.852V20.25H8.189A2.184 2.184 0 0 1 6 18.063z' })));
const ForwardRef = forwardRef(StandalonePresentationScreenBoldIcon);
export default ForwardRef;
