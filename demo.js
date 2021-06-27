import React from 'react';
import { render } from 'react-dom';
import { Popup, PopupPosition } from './src';

import styled from 'styled-components';

const PopupContent = styled.div`
    padding: 5px 10px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 200px 200px;
    width: 50vw;
    margin: 0px auto;
    grid-gap: 50px;
`;

const Button = styled.button`
    width: 100%;
`;

const ButtoWithPopup = React.forwardRef((props, ref) => (
    <Button ref={ref} onClick={props.showPopup}>
        {props.children}
    </Button>
));

const customPosFn = (offset) => ({ containerSize }) => {
    return containerSize.top + offset + 'px';
};

const Demo = () => (
    <div>
        <h1>Popup Demo</h1>
        <Grid>
            <Popup content={<PopupContent>Position bottom1</PopupContent>}>
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom (default)</Button>}
            </Popup>
            <Popup content={<PopupContent>Position top</PopupContent>} position={PopupPosition.TOP}>
                {({ showPopup }) => <Button onClick={showPopup}>Position top</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position left</PopupContent>}
                position={PopupPosition.LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position right</PopupContent>}
                position={PopupPosition.RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position right</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position top-left</PopupContent>}
                position={PopupPosition.TOP_LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top-left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position top-right</PopupContent>}
                position={PopupPosition.TOP_RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top-right</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position bottom-left</PopupContent>}
                position={PopupPosition.BOTTOM_LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom-left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position bottom-right</PopupContent>}
                position={PopupPosition.BOTTOM_RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom-right</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position bottom-center</PopupContent>}
                position={PopupPosition.BOTTOM_CENTER}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom-center</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position top-center</PopupContent>}
                position={PopupPosition.TOP_CENTER}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top-center</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position left-center</PopupContent>}
                position={PopupPosition.LEFT_CENTER}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position left-center</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Position right-center</PopupContent>}
                position={PopupPosition.RIGHT_CENTER}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position right-center</Button>}
            </Popup>

            <Popup
                content={<PopupContent>Top left aligned</PopupContent>}
                position={PopupPosition.TOP_LEFT_ALIGN}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top left aligned</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Top right aligned</PopupContent>}
                position={PopupPosition.TOP_RIGHT_ALIGN}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top right aligned</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Bottom left aligned</PopupContent>}
                position={PopupPosition.BOTTOM_LEFT_ALIGN}
            >
                {({ showPopup }) => (
                    <Button onClick={showPopup}>Position bottom left aligned</Button>
                )}
            </Popup>
            <Popup
                content={<PopupContent>Bottom right aligned</PopupContent>}
                position={PopupPosition.BOTTOM_RIGHT_ALIGN}
                closeOnScroll={false}
            >
                {({ showPopup }) => (
                    <Button onClick={showPopup}>Position bottom right aligned</Button>
                )}
            </Popup>
        </Grid>
        <h2>Custom Position</h2>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div>
                <Popup
                    content={<PopupContent>Custom position 1</PopupContent>}
                    position={PopupPosition.CUSTOM({ top: 10, left: 10 })}
                >
                    <ButtoWithPopup>Top: 10px, Left: 10px</ButtoWithPopup>
                </Popup>
                <Popup
                    content={<PopupContent>Custom position 2</PopupContent>}
                    position={PopupPosition.CUSTOM({ top: customPosFn(200) })}
                    popupStyle={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}
                >
                    <ButtoWithPopup>Top = 200 + parent top</ButtoWithPopup>
                </Popup>
            </div>
        </div>
        <h2>In view detection</h2>
        <p>
            The button below has popup set to render at the left of the button, but the popup will
            be out of view so it is auto adjusted to placed at the opposite direction
        </p>
        <div style={{ width: '100px' }}>
            <Popup
                content={<PopupContent>Popup content out of view</PopupContent>}
                position={PopupPosition.LEFT}
            >
                {({ togglePopup }) => (
                    <button onClick={togglePopup}>Position left but out of view</button>
                )}
            </Popup>
        </div>
        <h2>Styling Popup</h2>
        <p>
            Use popupStyle prop to style Popup or override the CustomPopupContentContainer prop with
            another styled component
        </p>
        <div style={{ width: '100px' }}>
            <Popup
                content={<PopupContent>Custom popup style</PopupContent>}
                popupStyle={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Custom popup style</Button>}
            </Popup>
        </div>
    </div>
);

render(<Demo />, document.getElementById('root'));
