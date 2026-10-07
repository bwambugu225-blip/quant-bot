import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagCuracaoIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#012A7E', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#FAE813', d: 'M24 9H0v3h24z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm4.522 5.9-.94.495.178-1.048L3 4.605l1.052-.152.47-.953.47.954 1.052.151-.762.743.18 1.047M2.761 3.2l-.47.247.09-.523L2 2.552l.526-.076L2.76 2l.235.477.526.076-.38.37.089.524', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagCuracaoIcon);
export default ForwardRef;
