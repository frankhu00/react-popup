import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { PopupContainer, PopupContentContainer } from './styled';
import {
    computePopupOrientation,
    handleOrientationResults,
    PopupPosition,
    extractDOMRect,
} from './helper';

const PopupContext = createContext();
export const usePopupContext = () => useContext(PopupContext);
export const Popup = ({
    content,
    children,
    onPopupShow,
    onPopupClose,
    showOnRender = false,
    closeOnOffClick = true,
    position = PopupPosition.BOTTOM,
    popupStyle,
    CustomPopupContainer = PopupContainer,
    CustomPopupContentContainer = PopupContentContainer,
    zIndex = 3,
    persist = false,
    forcePosition = false, //turns off checking for in view port rendering
    marginX = 5, //see handleOrientationResults
    marginY = 5,
    bufferX = 25, //buffer when trying to calculate if popup will fit in the specified position
    bufferY = 25,
    ...props
}) => {
    const node = useRef();
    const popupNode = useRef();
    const [containerSize, setContainerSize] = useState(null);
    const [show, setShow] = useState(showOnRender);
    const [positionStyle, setPositionStyle] = useState(
        handleOrientationResults(position, { marginX, marginY })
    );
    const [dynamicContent, setDynamicContent] = useState(null);

    useEffect(() => {
        if (node && node.current && typeof node.current.getBoundingClientRect === 'function') {
            setContainerSize(extractDOMRect(node.current.getBoundingClientRect()));
        }
    }, [node.current]);

    useEffect(() => {
        if (show) {
            const popupSize = extractDOMRect(popupNode.current.getBoundingClientRect());
            document.addEventListener('mousedown', handleClickOutside);
            if (typeof onPopupShow === 'function') {
                onPopupShow();
            }

            if (containerSize && !forcePosition) {
                const orientation = computePopupOrientation(popupSize, containerSize, {
                    x: bufferX,
                    y: bufferY,
                    preferredOrientation: position,
                });

                //only update position if it needed to be changed to fit in the view
                if (JSON.stringify(position) !== JSON.stringify(orientation)) {
                    const popupPositionStyle = handleOrientationResults(orientation, {
                        marginX,
                        marginY,
                    });
                    setPositionStyle(popupPositionStyle);
                }
            } else {
                console.warn(
                    `Could not determine popup container size. Failed to auto-adjust popup to render in view port`
                );
                setPositionStyle(handleOrientationResults(position));
            }
        } else {
            if (typeof onPopupClose === 'function') {
                onPopupClose();
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [show]);

    useEffect(() => {
        if (showOnRender !== show) {
            setShow(showOnRender);
        }
    }, [showOnRender]);

    const handleClickOutside = (e) => {
        if (closeOnOffClick && !node.current.contains(e.target)) {
            setShow(false);
        }
    };

    const [CustomComponent, setCustomComponent] = useState({
        Container: CustomPopupContainer,
        Content: CustomPopupContentContainer,
    });

    const updateCustomComponents = (comps) => {
        setCustomComponent((prev) => ({ ...prev, ...comps }));
    };

    const setPopupState = (state) => {
        setShow(state);
    };

    const closePopup = setPopupState.bind(this, false);
    const showPopup = setPopupState.bind(this, true);
    const togglePopup = setPopupState.bind(this, !show);

    const prioritizePopupContent = () => {
        if (content) {
            return content;
        } else {
            return dynamicContent;
        }
    };

    const propsToPassDown = {
        showPopup,
        closePopup,
        togglePopup,
        setDynamicContent,
        updateCustomComponents,
    };

    return (
        <CustomComponent.Container ref={node} {...props}>
            <PopupContext.Provider value={propsToPassDown}>
                {typeof children === 'function'
                    ? children({ ...propsToPassDown, ...props })
                    : children}
            </PopupContext.Provider>
            {show || persist ? (
                <CustomComponent.Content
                    ref={popupNode}
                    show={show}
                    zIndex={zIndex}
                    style={{ ...popupStyle, ...positionStyle }}
                >
                    {typeof prioritizePopupContent() === 'function'
                        ? prioritizePopupContent()({ ...propsToPassDown, ...props })
                        : prioritizePopupContent()}
                </CustomComponent.Content>
            ) : null}
        </CustomComponent.Container>
    );
};
