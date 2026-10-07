import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyTradeTypeOptionsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.5 7a.5.5 0 0 1 .492.41L5 7.5v5.792l2.146-2.146a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 .057.638l-.057.07-3 3-.013.011-.039.033.052-.044A.5.5 0 0 1 4.5 15h-.02l-.052-.005L4.5 15a.5.5 0 0 1-.284-.089l-.018-.013-.04-.033-.012-.011-3-3a.5.5 0 0 1 .638-.765l.07.057L4 13.294V7.5a.5.5 0 0 1 .5-.5m7-6h.011q.032 0 .063.005za.5.5 0 0 1 .284.089l.018.013q.02.014.04.033l.012.011 3 3a.5.5 0 0 1-.638.765l-.07-.057L12 2.706V8.5a.5.5 0 0 1-.992.09L11 8.5V2.706l-2.148 2.15a.5.5 0 0 1-.638.057l-.07-.058a.5.5 0 0 1-.057-.637l.058-.07 3.001-3.002.013-.011.039-.033-.052.044A.5.5 0 0 1 11.5 1' })));
const ForwardRef = forwardRef(LegacyTradeTypeOptionsIcon);
export default ForwardRef;
