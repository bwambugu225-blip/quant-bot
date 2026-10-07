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
exports.Popover = exports.usePopover = exports.ArrowContainer = exports.useArrowContainer = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var PopoverPortal_1 = require("./PopoverPortal");
var util_1 = require("./util");
var usePopover_1 = require("./usePopover");
Object.defineProperty(exports, "usePopover", { enumerable: true, get: function () { return usePopover_1.usePopover; } });
var useMemoizedArray_1 = require("./useMemoizedArray");
var useHandlePrevValues_1 = require("./useHandlePrevValues");
var useArrowContainer_1 = require("./useArrowContainer");
Object.defineProperty(exports, "useArrowContainer", { enumerable: true, get: function () { return useArrowContainer_1.useArrowContainer; } });
var ArrowContainer_1 = require("./ArrowContainer");
Object.defineProperty(exports, "ArrowContainer", { enumerable: true, get: function () { return ArrowContainer_1.ArrowContainer; } });
var DEFAULT_POSITIONS = ['top', 'left', 'right', 'bottom'];
var PopoverInternal = (0, react_1.forwardRef)(function (_a, externalRef) {
    var isOpen = _a.isOpen, children = _a.children, content = _a.content, _b = _a.positions, externalPositions = _b === void 0 ? DEFAULT_POSITIONS : _b, _c = _a.align, align = _c === void 0 ? 'center' : _c, _d = _a.padding, padding = _d === void 0 ? 0 : _d, _e = _a.reposition, reposition = _e === void 0 ? true : _e, _f = _a.parentElement, parentElement = _f === void 0 ? window.document.body : _f, _g = _a.boundaryElement, boundaryElement = _g === void 0 ? parentElement : _g, containerClassName = _a.containerClassName, containerStyle = _a.containerStyle, transform = _a.transform, _h = _a.transformMode, transformMode = _h === void 0 ? 'absolute' : _h, _j = _a.boundaryInset, boundaryInset = _j === void 0 ? 0 : _j, onClickOutside = _a.onClickOutside, _k = _a.clickOutsideCapture, clickOutsideCapture = _k === void 0 ? false : _k;
    var positions = (0, useMemoizedArray_1.useMemoizedArray)(Array.isArray(externalPositions) ? externalPositions : [externalPositions]);
    var _l = (0, useHandlePrevValues_1.useHandlePrevValues)({
        positions: positions,
        reposition: reposition,
        transformMode: transformMode,
        transform: transform,
        boundaryElement: boundaryElement,
        boundaryInset: boundaryInset,
    }), prev = _l.prev, updatePrevValues = _l.updatePrevValues;
    var childRef = (0, react_1.useRef)();
    var _m = (0, react_1.useState)({
        align: align,
        nudgedLeft: 0,
        nudgedTop: 0,
        position: positions[0],
        padding: padding,
        childRect: util_1.EMPTY_RECT,
        popoverRect: util_1.EMPTY_RECT,
        parentRect: util_1.EMPTY_RECT,
        boundaryRect: util_1.EMPTY_RECT,
        boundaryInset: boundaryInset,
        violations: util_1.EMPTY_RECT,
        hasViolations: false,
    }), popoverState = _m[0], setPopoverState = _m[1];
    var onPositionPopover = (0, react_1.useCallback)(function (popoverState) { return setPopoverState(popoverState); }, []);
    var _o = (0, usePopover_1.usePopover)({
        isOpen: isOpen,
        childRef: childRef,
        containerClassName: containerClassName,
        parentElement: parentElement,
        boundaryElement: boundaryElement,
        transform: transform,
        transformMode: transformMode,
        positions: positions,
        align: align,
        padding: padding,
        boundaryInset: boundaryInset,
        reposition: reposition,
        onPositionPopover: onPositionPopover,
    }), positionPopover = _o.positionPopover, popoverRef = _o.popoverRef, scoutRef = _o.scoutRef;
    (0, react_1.useLayoutEffect)(function () {
        var shouldUpdate = true;
        var updatePopover = function () {
            var _a, _b;
            if (isOpen && shouldUpdate) {
                var childRect = (_a = childRef === null || childRef === void 0 ? void 0 : childRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                var popoverRect = (_b = popoverRef === null || popoverRef === void 0 ? void 0 : popoverRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
                if (childRect != null &&
                    popoverRect != null &&
                    (!(0, util_1.rectsAreEqual)(childRect, popoverState.childRect) ||
                        popoverRect.width !== popoverState.popoverRect.width ||
                        popoverRect.height !== popoverState.popoverRect.height ||
                        popoverState.padding !== padding ||
                        popoverState.align !== align ||
                        positions !== prev.positions ||
                        reposition !== prev.reposition ||
                        transformMode !== prev.transformMode ||
                        transform !== prev.transform ||
                        boundaryElement !== prev.boundaryElement ||
                        boundaryInset !== prev.boundaryInset)) {
                    positionPopover();
                }
                updatePrevValues();
                if (shouldUpdate) {
                    window.requestAnimationFrame(updatePopover);
                }
            }
        };
        updatePopover();
        return function () {
            shouldUpdate = false;
        };
    }, [
        align,
        boundaryElement,
        boundaryInset,
        isOpen,
        padding,
        popoverRef,
        popoverState.align,
        popoverState.childRect,
        popoverState.padding,
        popoverState.popoverRect.height,
        popoverState.popoverRect.width,
        positionPopover,
        positions,
        prev.boundaryElement,
        prev.boundaryInset,
        prev.positions,
        prev.reposition,
        prev.transform,
        prev.transformMode,
        reposition,
        transform,
        transformMode,
        updatePrevValues,
    ]);
    (0, react_1.useEffect)(function () {
        var popoverElement = popoverRef.current;
        Object.assign(popoverElement.style, containerStyle);
        return function () {
            Object.keys(containerStyle !== null && containerStyle !== void 0 ? containerStyle : {}).forEach(function (key) {
                return delete popoverElement.style[key];
            });
        };
    }, [containerStyle, isOpen, popoverRef]);
    var handleOnClickOutside = (0, react_1.useCallback)(function (e) {
        var _a, _b;
        if (isOpen &&
            !((_a = popoverRef.current) === null || _a === void 0 ? void 0 : _a.contains(e.target)) &&
            !((_b = childRef.current) === null || _b === void 0 ? void 0 : _b.contains(e.target))) {
            onClickOutside === null || onClickOutside === void 0 ? void 0 : onClickOutside(e);
        }
    }, [isOpen, onClickOutside, popoverRef]);
    var handleWindowResize = (0, react_1.useCallback)(function () {
        if (childRef.current && isOpen) {
            window.requestAnimationFrame(function () { return positionPopover(); });
        }
    }, [positionPopover, isOpen]);
    (0, react_1.useEffect)(function () {
        var body = parentElement.ownerDocument.body;
        body.addEventListener('click', handleOnClickOutside, clickOutsideCapture);
        body.addEventListener('contextmenu', handleOnClickOutside, clickOutsideCapture);
        window.addEventListener('resize', handleWindowResize);
        return function () {
            body.removeEventListener('click', handleOnClickOutside, clickOutsideCapture);
            body.removeEventListener('contextmenu', handleOnClickOutside, clickOutsideCapture);
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [clickOutsideCapture, handleOnClickOutside, handleWindowResize, parentElement]);
    var handleRef = (0, react_1.useCallback)(function (node) {
        childRef.current = node;
        if (externalRef != null) {
            if (typeof externalRef === 'object') {
                externalRef.current = node;
            }
            else if (typeof externalRef === 'function') {
                externalRef(node);
            }
        }
    }, [externalRef]);
    var renderChild = function () { return (0, react_1.cloneElement)(children, { ref: handleRef }); };
    var renderPopover = function () {
        if (!isOpen)
            return null;
        return ((0, jsx_runtime_1.jsx)(PopoverPortal_1.PopoverPortal, { element: popoverRef.current, scoutElement: scoutRef.current, container: parentElement, children: typeof content === 'function' ? content(popoverState) : content }));
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [renderChild(), renderPopover()] }));
});
exports.Popover = (0, react_1.forwardRef)(function (props, ref) {
    if (typeof window === 'undefined')
        return props.children;
    return (0, jsx_runtime_1.jsx)(PopoverInternal, __assign({}, props, { ref: ref }));
});
//# sourceMappingURL=Popover.js.map