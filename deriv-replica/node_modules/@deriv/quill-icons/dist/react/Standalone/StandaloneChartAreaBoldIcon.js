import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartAreaBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.875 8.688v13.75c0 .546.39.937.938.937h16.25a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H8.813A2.8 2.8 0 0 1 6 22.438V8.688c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938m9.297 6.64-2.422-2.422-3.125 3.125v3.594h11.25v-3.047l-1.992-2.305-1.094 1.055a1.84 1.84 0 0 1-2.617 0M18.5 14l1.29-1.29.233-.233a1.264 1.264 0 0 1 1.836.078l2.422 2.812c.274.352.469.781.469 1.211v3.672c0 .703-.586 1.25-1.25 1.25H11c-.703 0-1.25-.547-1.25-1.25v-4.219c0-.468.195-.976.547-1.328l3.555-3.555c.468-.468 1.289-.468 1.757 0l1.563 1.563z' })));
const ForwardRef = forwardRef(StandaloneChartAreaBoldIcon);
export default ForwardRef;
