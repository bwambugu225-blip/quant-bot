"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var useArrowContainer_1 = require("./useArrowContainer");
var ArrowContainer = function (_a) {
    var childRect = _a.childRect, popoverRect = _a.popoverRect, position = _a.position, arrowColor = _a.arrowColor, arrowSize = _a.arrowSize, arrowClassName = _a.arrowClassName, externalArrowStyle = _a.arrowStyle, className = _a.className, children = _a.children, externalArrowContainerStyle = _a.style;
    var _b = (0, useArrowContainer_1.useArrowContainer)({
        childRect: childRect,
        popoverRect: popoverRect,
        position: position,
        arrowColor: arrowColor,
        arrowSize: arrowSize,
    }), arrowContainerStyle = _b.arrowContainerStyle, arrowStyle = _b.arrowStyle;
    var mergedContainerStyle = (0, react_1.useMemo)(function () { return (__assign(__assign({}, arrowContainerStyle), externalArrowContainerStyle)); }, [arrowContainerStyle, externalArrowContainerStyle]);
    var mergedArrowStyle = (0, react_1.useMemo)(function () { return (__assign(__assign({}, arrowStyle), externalArrowStyle)); }, [arrowStyle, externalArrowStyle]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, style: mergedContainerStyle, children: [(0, jsx_runtime_1.jsx)("div", { style: mergedArrowStyle, className: arrowClassName }), children] }));
};
exports.ArrowContainer = ArrowContainer;
//# sourceMappingURL=ArrowContainer.js.map