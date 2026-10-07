import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFlagCheckeredFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 6.5c.664 0 1.25.586 1.25 1.25v.625l2.695-.664c1.485-.352 3.047-.195 4.414.508a6.45 6.45 0 0 0 5.743 0l.39-.196c.781-.39 1.758.196 1.758 1.094v10.899c0 .547-.352 1.015-.82 1.172l-1.367.507c-1.797.703-3.829.586-5.547-.273a6.95 6.95 0 0 0-4.766-.547l-2.5.625v3.75c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V7.75c0-.664.547-1.25 1.25-1.25m1.25 7.344 2.5-.547v2.539l-2.5.547v2.539l1.875-.469c.195-.039.39-.078.625-.117v-2.5l1.484-.313c.352-.078.664-.117 1.016-.078v-2.5c.508 0 1.055.078 1.563.235l.937.273v2.617l-1.64-.508a3.3 3.3 0 0 0-.86-.117v2.774c.82.078 1.68.273 2.5.547V16.07l.86.235a8 8 0 0 0 1.64.312v-2.539c-.312 0-.625-.078-.937-.156l-1.563-.469v-2.422a12 12 0 0 1-1.523-.586 5 5 0 0 0-.977-.351v2.851q-.762-.059-1.523.117l-.977.235v-2.969l-2.5.625zm10 5.781c.625.078 1.29-.04 1.953-.273l.547-.196v-2.812l-.312.078c-.743.156-1.485.234-2.188.195zm2.5-5.82V11.03c-.82.235-1.68.352-2.5.352v2.695A4.4 4.4 0 0 0 21.352 14z' })));
const ForwardRef = forwardRef(StandaloneFlagCheckeredFillIcon);
export default ForwardRef;
