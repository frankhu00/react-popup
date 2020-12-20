import { useState, useEffect } from 'react';

const PopupPosition = {
    TOP: { top: 1, bottom: 0, left: 0, right: 0 },
    TOP_RIGHT: { top: 1, bottom: 0, left: 0, right: 1 },
    TOP_LEFT: { top: 1, bottom: 0, left: 1, right: 0 },
    BOTTOM: { top: 0, bottom: 1, left: 0, right: 0 },
    BOTTOM_LEFT: { top: 0, bottom: 1, left: 1, right: 0 },
    BOTTOM_RIGHT: { top: 0, bottom: 1, left: 0, right: 1 },
    LEFT: { top: 0, bottom: 0, left: 1, right: 0 },
    RIGHT: { top: 0, bottom: 0, left: 0, right: 1 },
};

const computePopupOrientation = (
    size,
    parentSize,
    { x: bufferX = 10, y: bufferY = 10, preferredOrientation = PopupPosition.BOTTOM } = {}
) => {
    const orientation = { ...preferredOrientation };
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

const handleOrientationResults = (orientation, { marginX = 5, marginY = 5 } = {}) => {
    const { top, bottom, left, right } = orientation;
    const hasVertical = top || bottom;
    const hasHorizontal = left || right;

    const result = {};

    if (hasVertical) {
        if (top) {
            result.bottom = '100%'; //pushes it to the top of parent
        }
        result.margin = `${marginY}px 0px`;
    }

    if (hasHorizontal) {
        if (left) {
            result.right = '100%'; //pushes it to the left of parent
        } else {
            result.left = '100%';
        }

        //If only horizontal and no vertical, then need to set top: 0px;
        if (!hasVertical) {
            result.top = '0px';
            result.margin = `0px ${marginX}px`;
        } else {
            result.margin = `${marginY}px ${marginX}px`;
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
