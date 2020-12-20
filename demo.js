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
    grid-gap: 10px;
`;

const Button = styled.button`
    width: 100%;
`;

const Demo = () => (
    <div>
        <h1>Popup Demo</h1>
        <Grid>
            <Popup content={<PopupContent>Popup content 1</PopupContent>}>
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom (default)</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 2</PopupContent>}
                position={PopupPosition.TOP}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 3</PopupContent>}
                position={PopupPosition.LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 4</PopupContent>}
                position={PopupPosition.RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position right</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 5</PopupContent>}
                position={PopupPosition.TOP_LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top-left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 6</PopupContent>}
                position={PopupPosition.TOP_RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position top-right</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 7</PopupContent>}
                position={PopupPosition.BOTTOM_LEFT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom-left</Button>}
            </Popup>
            <Popup
                content={<PopupContent>Popup content 8</PopupContent>}
                position={PopupPosition.BOTTOM_RIGHT}
            >
                {({ showPopup }) => <Button onClick={showPopup}>Position bottom-right</Button>}
            </Popup>
        </Grid>
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
                {({ showPopup }) => (
                    <button onClick={showPopup}>Position left but out of view</button>
                )}
            </Popup>
        </div>
    </div>
);

render(<Demo />, document.getElementById('root'));
