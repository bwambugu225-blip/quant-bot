"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePopover = void 0;
var react_1 = require("react");
var util_1 = require("./util");
var useElementRef_1 = require("./useElementRef");
var POPOVER_STYLE = {
    position: 'fixed',
    overflow: 'visible',
    top: '0px',
    left: '0px',
};
var SCOUT_STYLE = {
    position: 'fixed',
    top: '0px',
    left: '0px',
    width: '0px',
    height: '0px',
    visibility: 'hidden',
};
var usePopover = function (_a) {
    var isOpen = _a.isOpen, childRef = _a.childRef, positions = _a.positions, containerClassName = _a.containerClassName, parentElement = _a.parentElement, transform = _a.transform, transformMode = _a.transformMode, align = _a.align, padding = _a.padding, reposition = _a.reposition, boundaryInset = _a.boundaryInset, boundaryElement = _a.boundaryElement, onPositionPopover = _a.onPositionPopover;
    var scoutRef = (0, useElementRef_1.useElementRef)({
        containerClassName: 'react-tiny-popover-scout',
        containerStyle: SCOUT_STYLE,
    });
    var popoverRef = (0, useElementRef_1.useElementRef)({
        containerClassName: containerClassName != null &&
            containerClassName.length > 0 &&
            containerClassName !== 'react-tiny-popover-container'
            ? "react-tiny-popover-container ".concat(containerClassName)
            : 'react-tiny-popover-container',
        containerStyle: POPOVER_STYLE,
    });
    var positionPopover = (0, react_1.useCallback)(function (_a) {
        var _b, _c;
        var _d = _a === void 0 ? {} : _a, _e = _d.positionIndex, positionIndex = _e === void 0 ? 0 : _e, _f = _d.parentRect, parentRect = _f === void 0 ? parentElement.getBoundingClientRect() : _f, _g = _d.childRect, childRect = _g === void 0 ? (_b = childRef === null || childRef === void 0 ? void 0 : childRef.current) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect() : _g, _h = _d.scoutRect, scoutRect = _h === void 0 ? (_c = scoutRef === null || scoutRef === void 0 ? void 0 : scoutRef.current) === null || _c === void 0 ? void 0 : _c.getBoundingClientRect() : _h, _j = _d.popoverRect, popoverRect = _j === void 0 ? popoverRef.current.getBoundingClientRect() : _j, _k = _d.boundaryRect, boundaryRect = _k === void 0 ? boundaryElement === parentElement
            ? parentRect
            : boundaryElement.getBoundingClientRect() : _k;
        if (!childRect || !parentRect || !isOpen) {
            return;
        }
        if (transform && transformMode === 'absolute') {
            var _l = typeof transform === 'function'
                ? transform({
                    childRect: childRect,
                    popoverRect: popoverRect,
                    parentRect: parentRect,
                    boundaryRect: boundaryRect,
                    padding: padding,
                    align: align,
                    nudgedTop: 0,
                    nudgedLeft: 0,
                    boundaryInset: boundaryInset,
                    violations: util_1.EMPTY_RECT,
                    hasViolations: false,
                })
                : transform, inputTop = _l.top, inputLeft = _l.left;
            var finalLeft_1 = Math.round(parentRect.left + inputLeft - scoutRect.left);
            var finalTop_1 = Math.round(parentRect.top + inputTop - scoutRect.top);
            popoverRef.current.style.transform = "translate(".concat(finalLeft_1, "px, ").concat(finalTop_1, "px)");
            onPositionPopover({
                childRect: childRect,
                popoverRect: (0, util_1.createRect)({
                    left: finalLeft_1,
                    top: finalTop_1,
                    width: popoverRect.width,
                    height: popoverRect.height,
                }),
                parentRect: parentRect,
                boundaryRect: boundaryRect,
                padding: padding,
                align: align,
                transform: { top: inputTop, left: inputLeft },
                nudgedTop: 0,
                nudgedLeft: 0,
                boundaryInset: boundaryInset,
                violations: util_1.EMPTY_RECT,
                hasViolations: false,
            });
            return;
        }
        var isExhausted = positionIndex === positions.length;
        var position = isExhausted ? positions[0] : positions[positionIndex];
        var _m = (0, util_1.getNewPopoverRect)({
            childRect: childRect,
            popoverRect: popoverRect,
            boundaryRect: boundaryRect,
            position: position,
            align: align,
            padding: padding,
            reposition: reposition,
        }, boundaryInset), rect = _m.rect, boundaryViolation = _m.boundaryViolation;
        if (boundaryViolation && reposition && !isExhausted) {
            positionPopover({
                positionIndex: positionIndex + 1,
                childRect: childRect,
                popoverRect: popoverRect,
                parentRect: parentRect,
                boundaryRect: boundaryRect,
            });
            return;
        }
        var top = rect.top, left = rect.left, width = rect.width, height = rect.height;
        var shouldNudge = reposition && !isExhausted;
        var _o = (0, util_1.getNudgedPopoverRect)(rect, boundaryRect, boundaryInset), nudgedLeft = _o.left, nudgedTop = _o.top;
        var finalTop = top;
        var finalLeft = left;
        if (shouldNudge) {
            finalTop = nudgedTop;
            finalLeft = nudgedLeft;
        }
        finalTop = Math.round(finalTop - scoutRect.top);
        finalLeft = Math.round(finalLeft - scoutRect.left);
        popoverRef.current.style.transform = "translate(".concat(finalLeft, "px, ").concat(finalTop, "px)");
        var potentialViolations = {
            top: boundaryRect.top + boundaryInset - finalTop,
            left: boundaryRect.left + boundaryInset - finalLeft,
            right: finalLeft + width - boundaryRect.right + boundaryInset,
            bottom: finalTop + height - boundaryRect.bottom + boundaryInset,
        };
        var popoverState = {
            childRect: childRect,
            popoverRect: (0, util_1.createRect)({ left: finalLeft, top: finalTop, width: width, height: height }),
            parentRect: parentRect,
            boundaryRect: boundaryRect,
            position: position,
            align: align,
            padding: padding,
            nudgedTop: nudgedTop - top,
            nudgedLeft: nudgedLeft - left,
            boundaryInset: boundaryInset,
            violations: {
                top: potentialViolations.top <= 0 ? 0 : potentialViolations.top,
                left: potentialViolations.left <= 0 ? 0 : potentialViolations.left,
                right: potentialViolations.right <= 0 ? 0 : potentialViolations.right,
                bottom: potentialViolations.bottom <= 0 ? 0 : potentialViolations.bottom,
            },
            hasViolations: potentialViolations.top > 0 ||
                potentialViolations.left > 0 ||
                potentialViolations.right > 0 ||
                potentialViolations.bottom > 0,
        };
        if (transform) {
            onPositionPopover(popoverState);
            var _p = typeof transform === 'function' ? transform(popoverState) : transform, transformTop = _p.top, transformLeft = _p.left;
            popoverRef.current.style.transform = "translate(".concat(Math.round(finalLeft + (transformLeft !== null && transformLeft !== void 0 ? transformLeft : 0)), "px, ").concat(Math.round(finalTop + (transformTop !== null && transformTop !== void 0 ? transformTop : 0)), "px)");
            popoverState.nudgedLeft += transformLeft !== null && transformLeft !== void 0 ? transformLeft : 0;
            popoverState.nudgedTop += transformTop !== null && transformTop !== void 0 ? transformTop : 0;
            popoverState.transform = { top: transformTop, left: transformLeft };
        }
        onPositionPopover(popoverState);
    }, [
        parentElement,
        childRef,
        scoutRef,
        popoverRef,
        boundaryElement,
        isOpen,
        transform,
        transformMode,
        positions,
        align,
        padding,
        reposition,
        boundaryInset,
        onPositionPopover,
    ]);
    return { positionPopover: positionPopover, popoverRef: popoverRef, scoutRef: scoutRef };
};
exports.usePopover = usePopover;
//# sourceMappingURL=usePopover.js.map