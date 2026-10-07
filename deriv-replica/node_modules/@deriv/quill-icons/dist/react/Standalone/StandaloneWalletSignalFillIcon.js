import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWalletSignalFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 10.25c0-1.367 1.094-2.5 2.5-2.5h15c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H6.625a.64.64 0 0 0-.625.625c0 .352.273.625.625.625H21c1.367 0 2.5 1.133 2.5 2.5v2.11a10.2 10.2 0 0 0-4.062-.86c-1.211 0-2.188 1.016-2.188 2.188v7.812H6a2.47 2.47 0 0 1-2.5-2.5zm15 7.188c0-.508.39-.938.938-.938 5 0 9.062 4.063 9.062 9.063 0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937 0-3.946-3.242-7.188-7.187-7.188-.547 0-.938-.39-.938-.937m0 3.75c0-.508.39-.938.938-.938a5.32 5.32 0 0 1 5.312 5.313c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937 0-1.875-1.562-3.438-3.437-3.438-.547 0-.938-.39-.938-.937m0 4.062c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneWalletSignalFillIcon);
export default ForwardRef;
