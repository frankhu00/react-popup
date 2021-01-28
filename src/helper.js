const _PopupPosition = {
    TOP: { name: 'TOP', top: 1, bottom: 0, left: 0, right: 0 },
    TOP_CENTER: { name: 'TOP_CENTER', top: 1, xCenter: 1 },
    TOP_RIGHT: { name: 'TOP_RIGHT', top: 1, bottom: 0, left: 0, right: 1 },
    TOP_LEFT: { name: 'TOP_LEFT', top: 1, bottom: 0, left: 1, right: 0 },
    BOTTOM: { name: 'BOTTOM', top: 0, bottom: 1, left: 0, right: 0 },
    BOTTOM_CENTER: { name: 'BOTTOM_CENTER', bottom: 1, xCenter: 1 },
    BOTTOM_LEFT: { name: 'BOTTOM_LEFT', top: 0, bottom: 1, left: 1, right: 0 },
    BOTTOM_RIGHT: { name: 'BOTTOM_RIGHT', top: 0, bottom: 1, left: 0, right: 1 },
    LEFT: { name: 'LEFT', top: 0, bottom: 0, left: 1, right: 0 },
    LEFT_CENTER: { name: 'LEFT_CENTER', top: 0, bottom: 0, left: 1, right: 0, yCenter: 1 },
    RIGHT: { name: 'RIGHT', top: 0, bottom: 0, left: 0, right: 1 },
    RIGHT_CENTER: { name: 'RIGHT_CENTER', top: 0, bottom: 0, left: 0, right: 1, yCenter: 1 },
    CUSTOM: ({ top, left, bottom, right }) => ({ name: 'CUSTOM', top, left, bottom, right }),
    CUSTOM_POSITION: { name: 'CUSTOM' },
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

const computeFixedCenterPosition = (popupSize, parentSize) => {
    const computation = (popupSize, parentSize) => (name) => {
        const coor = name == 'width' ? 'left' : 'top';
        const popupDimension = popupSize[name];
        const popupMid = popupDimension / 2;

        const parentDimension = parentSize[name];
        const parentCoord = parentSize[coor];
        const parentMid = parentDimension / 2;

        return parentMid + parentCoord - popupMid;
    };
    const getCenter = computation(popupSize, parentSize);
    return { x: getCenter('width'), y: getCenter('height') };
};

const computePopupOrientation = (
    size,
    parentSize,
    { x: bufferX = 10, y: bufferY = 10, preferredOrientation = _PopupPosition.BOTTOM } = {}
) => {
    // Custom positions do not have in-view bound restriction
    if (preferredOrientation.name === _PopupPosition.CUSTOM_POSITION.name) {
        return preferredOrientation;
    }

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

    let nameArr = [];
    //Test if preferredOrientation input is in viewport first
    if (top) {
        if (popupY > availableSpace.top) {
            orientation.top = 0;
            orientation.bottom = 1;
            nameArr.push('BOTTOM');
        } else {
            nameArr.push('TOP');
        }
    }

    if (bottom) {
        if (popupY > availableSpace.bottom) {
            orientation.top = 1;
            orientation.bottom = 0;
            nameArr.push('TOP');
        } else {
            nameArr.push('BOTTOM');
        }
    }

    if (left) {
        if (popupX > availableSpace.left) {
            orientation.left = 0;
            orientation.right = 1;
            nameArr.push('RIGHT');
        } else {
            nameArr.push('LEFT');
        }
    }

    if (right) {
        if (popupX > availableSpace.right) {
            orientation.left = 1;
            orientation.right = 0;
            nameArr.push('LEFT');
        } else {
            nameArr.push('RIGHT');
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
        nameArr.push('CENTER');
    }

    //Return preferred orientation if all constrains failed (no place to put the popup on top, bottom, left, and right)
    if (
        popupX > availableSpace.right &&
        popupX > availableSpace.left &&
        popupY > availableSpace.bottom &&
        popupY > availableSpace.top
    ) {
        orientation = preferredOrientation;
    } else {
        //Update the orientation name
        //uhh not sure if this method is reliable though lol
        orientation.name = nameArr.join('_');
    }
    return orientation;
};

const printOrientationCSSValue = (value, { containerSize, popupSize } = {}) => {
    if (typeof value === 'string') {
        return value;
    } else if (typeof value === 'number') {
        return value + 'px';
    } else if (typeof value === 'function') {
        return value({ containerSize, popupSize });
    } else {
        return null;
    }
};

const handleOrientationResults = (orientation, { containerSize, popupSize } = {}) => {
    const { name, top, bottom, left, right } = orientation;
    const { x: xCenter, y: yCenter } = computeFixedCenterPosition(popupSize, containerSize);
    const result = {};

    const { top: cTop, width: cWidth, height: cHeight, left: cLeft } = containerSize;
    const { width: pWidth, height: pHeight } = popupSize;

    switch (name) {
        case _PopupPosition.BOTTOM.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft}px`);
            break;
        case _PopupPosition.BOTTOM_RIGHT.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft + cWidth}px`);
            break;
        case _PopupPosition.BOTTOM_LEFT.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft - pWidth}px`);
            break;
        case _PopupPosition.BOTTOM_CENTER.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(`${xCenter}px`);
            break;
        case _PopupPosition.TOP_LEFT.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft - pWidth}px`);
            break;
        case _PopupPosition.TOP_RIGHT.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft + cWidth}px`);
            break;
        case _PopupPosition.TOP_CENTER.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(`${xCenter}px`);
            break;
        case _PopupPosition.TOP.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft}px`);
            break;
        case _PopupPosition.LEFT.name:
            result.top = printOrientationCSSValue(`${cTop}px`);
            result.left = printOrientationCSSValue(`${cLeft - pWidth}px`);
            break;
        case _PopupPosition.LEFT_CENTER.name:
            result.top = printOrientationCSSValue(`${yCenter}px`);
            result.left = printOrientationCSSValue(`${cLeft - pWidth}px`);
            break;
        case _PopupPosition.RIGHT.name:
            result.top = printOrientationCSSValue(`${cTop}px`);
            result.left = printOrientationCSSValue(`${cLeft + cWidth}px`);
            break;
        case _PopupPosition.RIGHT_CENTER.name:
            result.top = printOrientationCSSValue(`${yCenter}px`);
            result.left = printOrientationCSSValue(`${cLeft + cWidth}px`);
            break;
        case _PopupPosition.CUSTOM_POSITION.name:
            result.top = printOrientationCSSValue(top, { containerSize, popupSize });
            result.left = printOrientationCSSValue(left, { containerSize, popupSize });
            result.right = printOrientationCSSValue(right, { containerSize, popupSize });
            result.bottom = printOrientationCSSValue(bottom, { containerSize, popupSize });
            break;
        default:
            console.warn('Failed to determin popup position, using default');
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(`${cLeft}px`);
            break;
    }

    return result;
};

const emptyDOMRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
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

//Takes out the CUSTOM_POSITION
const { CUSTOM_POSITION, ...PopupPosition } = _PopupPosition;

export {
    computePopupOrientation,
    handleOrientationResults,
    PopupPosition,
    extractDOMRect,
    emptyDOMRect,
};
