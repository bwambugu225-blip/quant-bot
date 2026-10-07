import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTelegramIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.813c5.313 0 9.688 4.375 9.688 9.687 0 5.352-4.375 9.688-9.688 9.688A9.686 9.686 0 0 1 6.313 16.5c0-5.312 4.335-9.687 9.687-9.687m4.453 6.601a.66.66 0 0 0 0-.39c0-.079-.078-.196-.117-.235-.117-.117-.313-.117-.39-.117-.352 0-.938.195-3.634 1.328a245 245 0 0 0-5.625 2.422c-.468.195-.703.351-.742.547-.039.312.47.43 1.055.625.508.156 1.172.351 1.523.351.313 0 .665-.117 1.055-.39 2.617-1.797 3.985-2.696 4.063-2.696s.156-.039.195 0c.078.079.078.157.039.196-.04.195-2.5 2.46-2.656 2.617-.547.547-1.172.898-.196 1.523.82.547 1.29.899 2.149 1.446.547.351.976.78 1.523.742.274-.04.547-.274.664-1.016.352-1.68.977-5.43 1.094-6.953' })));
const ForwardRef = forwardRef(StandaloneTelegramIcon);
export default ForwardRef;
