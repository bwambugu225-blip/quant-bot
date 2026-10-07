"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandlePrevValues = void 0;
var react_1 = require("react");
var useHandlePrevValues = function (props) {
    var prevPositions = (0, react_1.useRef)(props.positions);
    var prevReposition = (0, react_1.useRef)(props.reposition);
    var prevTransformMode = (0, react_1.useRef)(props.transformMode);
    var prevTransform = (0, react_1.useRef)(props.transform);
    var prevBoundaryElement = (0, react_1.useRef)(props.boundaryElement);
    var prevBoundaryInset = (0, react_1.useRef)(props.boundaryInset);
    var updatePrevValues = (0, react_1.useCallback)(function () {
        prevPositions.current = props.positions;
        prevReposition.current = props.reposition;
        prevTransformMode.current = props.transformMode;
        prevTransform.current = props.transform;
        prevBoundaryElement.current = props.boundaryElement;
        prevBoundaryInset.current = props.boundaryInset;
    }, [
        props.boundaryElement,
        props.boundaryInset,
        props.positions,
        props.reposition,
        props.transform,
        props.transformMode,
    ]);
    return {
        prev: {
            positions: prevPositions.current,
            reposition: prevReposition.current,
            transformMode: prevTransformMode.current,
            transform: prevTransform.current,
            boundaryElement: prevBoundaryElement.current,
            boundaryInset: prevBoundaryInset.current,
        },
        updatePrevValues: updatePrevValues,
    };
};
exports.useHandlePrevValues = useHandlePrevValues;
//# sourceMappingURL=useHandlePrevValues.js.map