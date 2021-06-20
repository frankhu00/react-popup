const getAlignPosition = (type) => ({ containerSize, popupSize }) => {
    if (type === 'left') {
        return containerSize.x + 'px';
    } else {
        return Number(containerSize.x + (containerSize.width - popupSize.width)) + 'px';
    }
};

const _PopupPosition = {
    TOP: { name: 'TOP', top: 1, bottom: 0, left: 0, right: 0 },
    TOP_CENTER: { name: 'TOP_CENTER', top: 1, xCenter: 1 },
    TOP_RIGHT: { name: 'TOP_RIGHT', top: 1, bottom: 0, left: 0, right: 1 },
    TOP_RIGHT_ALIGN: { name: 'TOP_RIGHT_ALIGN', top: 1, left: 0, right: getAlignPosition('right') },
    TOP_LEFT: { name: 'TOP_LEFT', top: 1, bottom: 0, left: 1, right: 0 },
    TOP_LEFT_ALIGN: { name: 'TOP_LEFT_ALIGN', top: 1, left: getAlignPosition('left') },
    BOTTOM: { name: 'BOTTOM', top: 0, bottom: 1, left: 0, right: 0 },
    BOTTOM_CENTER: { name: 'BOTTOM_CENTER', bottom: 1, xCenter: 1 },
    BOTTOM_LEFT: { name: 'BOTTOM_LEFT', top: 0, bottom: 1, left: 1, right: 0 },
    BOTTOM_LEFT_ALIGN: { name: 'BOTTOM_LEFT_ALIGN', bottom: 1, left: getAlignPosition('left') },
    BOTTOM_RIGHT: { name: 'BOTTOM_RIGHT', top: 0, bottom: 1, left: 0, right: 1 },
    BOTTOM_RIGHT_ALIGN: { name: 'BOTTOM_RIGHT_ALIGN', bottom: 1, right: getAlignPosition('right') },
    LEFT: { name: 'LEFT', top: 0, bottom: 0, left: 1, right: 0 },
    LEFT_CENTER: { name: 'LEFT_CENTER', top: 0, bottom: 0, left: 1, right: 0, yCenter: 1 },
    RIGHT: { name: 'RIGHT', top: 0, bottom: 0, left: 0, right: 1 },
    RIGHT_CENTER: { name: 'RIGHT_CENTER', top: 0, bottom: 0, left: 0, right: 1, yCenter: 1 },
    CUSTOM: ({ top, left, bottom, right }) => ({ name: 'CUSTOM', top, left, bottom, right }),
    CUSTOM_POSITION: { name: 'CUSTOM' },
};

const conflictResolver = (conflictedDirection) => {
    switch (conflictedDirection) {
        case 'TOP':
            return 'BOTTOM';
        case 'BOTTOM':
            return 'TOP';
        case 'LEFT':
            return 'RIGHT';
        case 'RIGHT':
            return 'LEFT';
        case 'LEFT_ALIGN':
            return 'RIGHT_ALIGN';
        case 'RIGHT_ALIGN':
            return 'LEFT_ALIGN';
        case 'X_CENTER':
            return 'CENTER'; //there's not really much to do in this case
        case 'Y_CENTER':
            return 'CENTER';
        default:
            return conflictedDirection;
    }
};

const autoOrientationNameChecker = (generatedName) => {
    const allNames = Object.keys(_PopupPosition)
        .filter((k) => k !== 'CUSTOM')
        .map((key) => _PopupPosition[key].name);
    return allNames.indexOf(generatedName) > -1;
};

//TODO : Not sure how this will play with initial position setting with center on
//Since at initial state, the popupSize may be undefined
const computation = (popupSize, parentSize) => (name) => {
    const coor = name == 'width' ? 'left' : 'top';
    const popupDimension = popupSize[name];
    const popupMid = popupDimension / 2;

    const parentDimension = parentSize[name];
    const parentCoord = parentSize[coor];
    const parentMid = parentDimension / 2;

    return parentMid + parentCoord - popupMid;
};

const computeCenterPosition = (popupSize, parentSize) => {
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

    let conflicts = [];
    //Test if preferredOrientation input is in viewport first
    if (top) {
        if (popupY > availableSpace.top) {
            conflicts.push('TOP');
        }
    }

    if (bottom) {
        if (popupY > availableSpace.bottom) {
            conflicts.push('BOTTOM');
        }
    }

    if (left) {
        if (popupX > availableSpace.left) {
            conflicts.push('LEFT');
        }
    }

    if (right) {
        if (popupX > availableSpace.right) {
            conflicts.push('RIGHT');
        }
    }

    if (preferredOrientation.xCenter || preferredOrientation.yCenter) {
        const { x: xCenter, y: yCenter } = computeCenterPosition(size, parentSize);
        if (preferredOrientation.xCenter) {
            const needSpaceOnX = Math.abs(popupX - parentSize.width) / 2;
            if (availableSpace.right >= needSpaceOnX && availableSpace.left >= needSpaceOnX) {
                orientation.left = xCenter;
            } else {
                conflicts.push('X_CENTER');
            }
        }
        if (preferredOrientation.yCenter) {
            const needSpaceOnY = Math.abs(popupY - parentSize.height) / 2;
            if (availableSpace.top >= needSpaceOnY && availableSpace.bottom >= needSpaceOnY) {
                orientation.bottom = yCenter;
            } else {
                conflicts.push('Y_CENTER');
            }
        }
    }

    //Checks for left / right align
    const alignLength = Math.abs(popupX - parentSize.width);
    if (preferredOrientation.name.indexOf('_LEFT_ALIGN') > -1) {
        conflicts = conflicts.filter((c) => c !== 'LEFT'); //remove the left conflict check result
        if (availableSpace.right < alignLength) {
            //left align means you check the right side
            conflicts.push('LEFT_ALIGN');
        }
    } else if (preferredOrientation.name.indexOf('_RIGHT_ALIGN') > -1) {
        conflicts = conflicts.filter((c) => c !== 'RIGHT'); //remove the right conflict check result
        if (availableSpace.left < alignLength) {
            //right align means you check the left side
            conflicts.push('RIGHT_ALIGN');
        }
    }

    //Return preferred orientation if all constrains failed (no place to put the popup on top, bottom, left, and right)
    //This is the super conflict case, i.e no space to put popup anywhere
    if (
        popupX > availableSpace.right &&
        popupX > availableSpace.left &&
        popupY > availableSpace.bottom &&
        popupY > availableSpace.top
    ) {
        console.warn(
            'Popup detected a in-view boundary conflict when placing the popup and failed to auto-resolve. Using popup position defined as is'
        );
        orientation = preferredOrientation;
    } else {
        //Some conflicts found
        if (conflicts.length > 0) {
            //Try to opposite-ify the conflicts and create the new name there
            const resolvedConflictArr = conflicts.map((c) => conflictResolver(c));
            let resolvedNamed = resolvedConflictArr.join('_');
            //Check if its LEFT_ALIGN|RIGHT_ALIGN|CENTER resolved conflicts, since those have TOP_ or BOTTOM_ attached and needs to replace properly
            if (resolvedConflictArr.length === 1) {
                const matched = resolvedConflictArr[0].match(/^(LEFT_ALIGN|RIGHT_ALIGN|CENTER)$/i);
                if (matched && matched[1]) {
                    resolvedNamed = orientation.name.replace(conflicts[0], matched[1]);
                }
            }

            //Check if the resolved name matches any setting
            if (autoOrientationNameChecker(resolvedName)) {
                console.warn(`Popup detected a in-view boundary conflict when placing the popup and auto-resolved to use "PopupPosition.${resolvedName}"
                Please use set "forcePosition" to true to disable this feature.`);
                orientation = _PopupPosition[resolvedName];
            } else {
                console.warn(
                    'Popup detected a in-view boundary conflict when placing the popup and failed to auto-resolve. Using popup position defined as is'
                );
                console.warn(`Failed position name: "PopupPosition.${resolvedName}"`);
            }
        }
        //Just return otherwise
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
    const { x: xCenter, y: yCenter } = computeCenterPosition(popupSize, containerSize);
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
        case _PopupPosition.TOP_LEFT_ALIGN.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(left, { containerSize, popupSize });
            break;
        case _PopupPosition.TOP_RIGHT_ALIGN.name:
            result.top = printOrientationCSSValue(`${cTop - pHeight}px`);
            result.left = printOrientationCSSValue(right, { containerSize, popupSize });
            break;
        case _PopupPosition.BOTTOM_LEFT_ALIGN.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(left, { containerSize, popupSize });
            break;
        case _PopupPosition.BOTTOM_RIGHT_ALIGN.name:
            result.top = printOrientationCSSValue(`${cTop + cHeight}px`);
            result.left = printOrientationCSSValue(right, { containerSize, popupSize });
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
    computeCenterPosition,
};
