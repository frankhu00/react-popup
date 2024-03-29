import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { useDelayedUnmount } from '@frankhu00/react-animations';
import { PopupContentContainer } from './styled';
import {
    computePopupOrientation,
    handleOrientationResults,
    PopupPosition,
    extractDOMRect,
    emptyDOMRect,
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
    parentNode,
    CustomPopupContentContainer = PopupContentContainer,
    zIndex = 3,
    persist = false,
    forcePosition = false, //turns off checking for in view port rendering
    bufferX = 25, //buffer when trying to calculate if popup will fit in the specified position
    bufferY = 25,
    animationDuration = 500,
    closeOnScroll = true,
    ...props
}) => {
    const node = useRef();
    const popupNode = useRef();
    const [show, setShow, stage] = useDelayedUnmount(animationDuration, showOnRender);
    const [positionStyle, setPositionStyle] = useState(
        handleOrientationResults(position, {
            containerSize: emptyDOMRect,
            popupSize: emptyDOMRect,
        })
    );
    const [dynamicContent, setDynamicContent] = useState(null);

    useEffect(() => {
        if (show) {
            const popupSize = extractDOMRect(popupNode.current.getBoundingClientRect());
            const containerSize =
                parentNode && typeof parentNode.getBoundingClientRect === 'function'
                    ? extractDOMRect(parentNode.getBoundingClientRect())
                    : node &&
                      node.current &&
                      typeof node.current.getBoundingClientRect === 'function'
                    ? extractDOMRect(node.current.getBoundingClientRect())
                    : emptyDOMRect;
            document.addEventListener('mousedown', handleClickOutside);
            if (closeOnScroll) {
                document.addEventListener('scroll', closePopup);
            }
            if (typeof onPopupShow === 'function') {
                onPopupShow();
            }

            if (containerSize && !forcePosition) {
                const orientation = computePopupOrientation(popupSize, containerSize, {
                    x: bufferX,
                    y: bufferY,
                    preferredOrientation: position,
                });

                const popupPositionStyle = handleOrientationResults(orientation, {
                    containerSize,
                    popupSize,
                });
                setPositionStyle(popupPositionStyle);
            } else {
                if (!containerSize) {
                    console.warn(
                        `Could not determine popup container size. Failed to auto-adjust popup to render in view port`
                    );
                }
                setPositionStyle(handleOrientationResults(position, { containerSize, popupSize }));
            }
        } else {
            if (typeof onPopupClose === 'function') {
                onPopupClose();
            }
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (closeOnScroll) {
                document.removeEventListener('scroll', closePopup);
            }
        };
    }, [show]);

    useEffect(() => {
        if (showOnRender !== show) {
            setShow(showOnRender);
        }
    }, [showOnRender]);

    /*
    "Inside" is defined as the popup and the container element (parentNode doesn't count)
     */
    const handleClickOutside = (e) => {
        if ((popupNode.current || node.current || parentNode) && closeOnOffClick) {
            if (
                !(
                    popupNode.current.contains(e.target) ||
                    node.current.contains(e.target) ||
                    parentNode?.contains(e.target)
                )
            ) {
                setShow(false);
            }
        }
    };

    const setPopupState = (state) => {
        if (state !== show) {
            setShow(state);
        }
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
    };

    return (
        <>
            <PopupContext.Provider value={propsToPassDown}>
                {typeof children === 'function'
                    ? ((props) =>
                          React.cloneElement(children(props), {
                              ref: (ele) => (node.current = ele),
                          }))({
                          ...propsToPassDown,
                          ...props,
                      })
                    : React.cloneElement(children, {
                          ...propsToPassDown,
                          ...props,
                          ref: (ele) => (node.current = ele),
                      })}
            </PopupContext.Provider>
            {show || persist ? (
                <CustomPopupContentContainer
                    ref={popupNode}
                    show={show}
                    zIndex={zIndex}
                    style={{ ...popupStyle, ...positionStyle }}
                    stage={stage}
                    animationDuration={animationDuration}
                >
                    {typeof prioritizePopupContent() === 'function'
                        ? prioritizePopupContent()({ ...propsToPassDown, ...props })
                        : React.cloneElement(prioritizePopupContent(), {
                              ...propsToPassDown,
                              ...props,
                          })}
                </CustomPopupContentContainer>
            ) : null}
        </>
    );
};
