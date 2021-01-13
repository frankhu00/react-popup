const PopupPosition = {
    TOP: { top: 1, bottom: 0, left: 0, right: 0 },
    TOP_CENTER: { top: 1, xCenter: 1 },
    TOP_RIGHT: { top: 1, bottom: 0, left: 0, right: 1 },
    TOP_LEFT: { top: 1, bottom: 0, left: 1, right: 0 },
    BOTTOM: { top: 0, bottom: 0, left: 0, right: 0 },
    BOTTOM_CENTER: { bottom: 1, xCenter: 1 },
    BOTTOM_LEFT: { top: 0, bottom: 1, left: 1, right: 0 },
    BOTTOM_RIGHT: { top: 0, bottom: 1, left: 0, right: 1 },
    LEFT: { top: 0, bottom: 0, left: 1, right: 0 },
    LEFT_CENTER: { top: 0, bottom: 0, left: 1, right: 0, yCenter: 1 },
    RIGHT: { top: 0, bottom: 0, left: 0, right: 1 },
    RIGHT_CENTER: { top: 0, bottom: 0, left: 0, right: 1, yCenter: 1 },
};

//TODO : Not sure how this will play with initial position setting with center on
//Since at initial state, the popupSize may be undefined
const computeCenterPosition = (popupSize, parentSize) => {
    const computation = (popupSize, parentSize) => (name) => {
        const popupDimension = popupSize[name];
        const parentDimension = parentSize[name];
        const popupMid = popupDimension / 2;
        const parentMid = parentDimension / 2;
        const percentage = (parentMid - popupMid) / parentDimension;
        return percentage;
    };
    const getCenter = computation(popupSize, parentSize);
    return { x: getCenter('width'), y: getCenter('height') };
};

const computePopupOrientation = (
    size,
    parentSize,
    { x: bufferX = 10, y: bufferY = 10, preferredOrientation = PopupPosition.BOTTOM } = {}
) => {
    let orientation = { ...preferredOrientation };
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const popupX = size.width;
    const popupY = size.height;

    const availableSpace = {
        top: parentSize.y - bufferY,
        bottom: winHeight - (parentSize.y + parentSize.height + bufferY),
        left: parentSize.x - bufferX,
        right: winWidth - (parentSize.x + parentSize.width + bufferX),
    };

    const { top, bottom, left, right } = orientation;

    //TODO : Need to make sure how center will play with bound contrains

    //Test if preferredOrientation input is in viewport first
    if (top) {
        if (popupY > availableSpace.top) {
            orientation.top = 0;
            orientation.bottom = 1;
        }
    }

    if (bottom) {
        if (popupY > availableSpace.bottom) {
            orientation.top = 1;
            orientation.bottom = 0;
        }
    }

    if (left) {
        if (popupX > availableSpace.left) {
            orientation.left = 0;
            orientation.right = 1;
        }
    }

    if (right) {
        if (popupX > availableSpace.right) {
            orientation.left = 1;
            orientation.right = 0;
        }
    }

    if (preferredOrientation.xCenter || preferredOrientation.yCenter) {
        const { x: xCenter, y: yCenter } = computeCenterPosition(size, parentSize);
        if (preferredOrientation.xCenter) {
            orientation.left = xCenter;
        }
        if (preferredOrientation.yCenter) {
            orientation.bottom = yCenter;
        }
    }

    //Return preferred orientation if all constrains failed (no place to put the popup on top, bottom, left, and right)
    if (
        popupX > availableSpace.right &&
        popupX > availableSpace.left &&
        popupY > availableSpace.bottom &&
        popupY > availableSpace.top
    ) {
        orientation = preferredOrientation;
    }

    return orientation;
};

const printOrientationCSSValue = (value) => {
    if (typeof value === 'string') {
        return value;
    } else if (typeof value === 'number') {
        return value * 100 + '%';
    }
};

const handleOrientationResults = (orientation) => {
    const { top, bottom, left, right } = orientation;
    const hasVertical = top || bottom;
    const hasHorizontal = left || right;

    const result = {};
    if (hasVertical) {
        if (top) {
            result.bottom = printOrientationCSSValue(top); //pushes it to the top of parent
        } else if (bottom) {
            //note the else IF
            result.top = printOrientationCSSValue(bottom);
        }
    }

    if (hasHorizontal) {
        if (left) {
            result.right = printOrientationCSSValue(left); //pushes it to the left of parent
        } else {
            result.left = printOrientationCSSValue(right);
        }

        //If only horizontal and no vertical, then need to set top: 0px;
        if (!hasVertical) {
            result.top = '0px';
        }
    }

    return result;
};

const extractDOMRect = (domRect) => ({
    bottom: domRect.bottom,
    height: domRect.height,
    left: domRect.left,
    right: domRect.right,
    top: domRect.top,
    width: domRect.width,
    x: domRect.x,
    y: domRect.y,
});

export { computePopupOrientation, handleOrientationResults, PopupPosition, extractDOMRect };
