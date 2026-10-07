import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneHuaweiAppGalleryIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm14.984 17.203-.351.899-.04.078h.821l-.039-.078zM21.313 6.5A4.7 4.7 0 0 1 26 11.188v10.664c0 2.578-2.11 4.648-4.687 4.648H10.648A4.635 4.635 0 0 1 6 21.852V11.188C6 8.609 8.07 6.5 10.648 6.5zm-3.399 10-.586 1.875-.586-1.875h-.547l.899 2.734h.468l.586-1.797.586 1.797h.43l.938-2.734h-.547l-.586 1.875-.586-1.875zm-3.125 0-1.172 2.734h.547l.234-.507v-.04h1.211l.235.547h.547l-1.133-2.695V16.5zm8.32 0v2.734h.547V16.5zm-15 0v2.734h.547v-1.093h1.172v1.093h.547V16.5h-.547v1.133H8.656V16.5zm4.727 0v1.563c0 .468-.234.703-.586.703-.39 0-.625-.235-.625-.703v-1.524h-.508v1.523c0 .782.39 1.211 1.094 1.211.742 0 1.133-.43 1.133-1.21V16.5zm7.695 0v2.734h1.953v-.507H21.04v-.665h.977v-.507h-.977v-.547h1.406V16.5zm-8.203-6.797c0 1.914 1.602 3.438 3.555 3.438s3.555-1.524 3.555-3.438h-.508c0 1.64-1.367 2.93-3.047 2.93s-3.047-1.29-3.047-2.93z' })));
const ForwardRef = forwardRef(StandaloneHuaweiAppGalleryIcon);
export default ForwardRef;
