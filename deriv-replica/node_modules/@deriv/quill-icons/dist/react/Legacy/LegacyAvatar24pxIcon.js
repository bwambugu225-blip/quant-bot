import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAvatar24pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 24, height: 24, fill: '#FF444F', rx: 12 }),
    React.createElement("path", { fill: '#fff', d: 'm10.471 17-.84-2.472H6.247L5.407 17h-1.02l2.928-8.376H8.6L11.527 17zM7.963 9.56h-.06l-1.416 4.08H9.38zm4.952-.936h3.444q1.044 0 1.632.588.6.588.6 1.572 0 .468-.132.792t-.336.54q-.204.204-.444.312a2.3 2.3 0 0 1-.444.132v.072q.228.012.504.12.288.108.54.348.252.228.42.6.18.36.18.876t-.168.96a2.3 2.3 0 0 1-.444.768q-.288.324-.684.516-.396.18-.864.18h-3.804zm1.008 7.488h2.484q.648 0 1.02-.324.372-.336.372-.972v-.408q0-.636-.372-.96-.372-.336-1.02-.336h-2.484zm0-3.864h2.316q.6 0 .936-.3t.336-.864v-.408q0-.564-.336-.864t-.936-.3h-2.316z' })));
const ForwardRef = forwardRef(LegacyAvatar24pxIcon);
export default ForwardRef;
