# React Popup

A simple `react` + `styled-components` popup

## Package Interface

Named exports: `Popup`, `usePopupContext`, `PopupPosition`, `PopupContentContainer`, `extractDOMRect`, and `computeCenterPosition`
Default export: `Popup`

## Usages

**_Note: The immediate child to Popup should not be React.Fragment_**  
**_If the immediate child must be a fragment, you need to supply a "parent container" DOM node for the popup to attach to via `parentNode` prop_**

### 1) Pass in a function as children to access popup methods

```javascript
<Popup content={() => <div>Popup Content</div>}>
    {({ showPopup }) => <button onClick={showPopup}>Button to trigger popup</button>}
</Popup>
```

### 2) Popup methods are passed to the direct descendant

```javascript
// NOTE: You must use React.forwardRef when using a functional component as the child
// Traditional class components are fine as they can take ref props
const SampleButton = React.forwardRef((props, ref) => (
    <Button ref={ref} onClick={props.showPopup}>
        BUTTON
    </Button>
));

<Popup content={() => <div>Popup Content</div>}>
    <SampleButton />
</Popup>;
```

### 3) Using ContextAPI to access popup methods

```javascript
const GrandchildButton = () => {
    const { showPopup } = usePopupContext();

    return <button onClick={showPopup}>Grandchild Button</button>;
};

<Popup content={() => <div>Popup Content</div>}>
    <div className="component-container">
        <GrandchildButton />
    </div>
</Popup>;
```

## Popup Positions

The `PopupPosition` has the following options:

-   `TOP`
-   `TOP_LEFT`
-   `TOP_RIGHT`
-   `TOP_CENTER`
-   `BOTTOM` (default)
-   `BOTTOM_LEFT`
-   `BOTTOM_RIGHT`
-   `BOTTOM_CENTER`
-   `LEFT`
-   `LEFT_CENTER`
-   `RIGHT`
-   `RIGHT_CENTER`
-   `CUSTOM`

Pass in the option to the `position` prop. The position of the popup are by default adjusted to fit in view, when popups are determined to be going out of view
with the specified position, the component will auto-adjust the position of the popup so that it stays in view. To turn this feature off, do `forcePosition={true}`.

**Auto position adjust will be turned off if position is set to `PopupPosition.CUSTOM`**

## Custom Popup Positions

You can specify custom position by calling

```javascript
const position = PopupPosition.CUSTOM({ top, left, bottom, right });
```

> The properties `top`, `left`, `bottom`, `right` are numbers, strings, or functions
>
> -   If the properties are strings, it should include a valid CSS unit, I.E "100px", "100%", etc
> -   If the properties are numbers (denoted N), it will be translated to `N + "px"`, that is, 2 will be translated to 2px.
> -   If the properties are functions, then it will be passed `{ containerSize, popupSize }` as 1st parameter and needs to resolve to a valid string representation of css value. `containerSize` and `popupSize` are objects containing various position data for the respective object
> -   **Auto position adjust will be turned off if position is set to `PopupPosition.CUSTOM`**

## Popup Props

| Prop                        | Type          | Default                       | Description                                                                                                                                                                                                                         |
| --------------------------- | ------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------------------- | ------------- | ---------------------         | -------------------------------------------------------------------------------------------                                                                                                                                         |
| content                     | Component     | undefined                     | A component or function that returns a component to serve as the popup content                                                                                                                                                      |
| onPopupShow                 | func          | undefined                     | Function to trigger when the popup is shown                                                                                                                                                                                         |
| onPopupClose                | func          | undefined                     | Function to trigger when the popup is closed                                                                                                                                                                                        |
| showOnRender                | boolean       | false                         | If true, popup will display when mounted                                                                                                                                                                                            |
| closeOnOffClick             | boolean       | true                          | If true, clicking off the popup will close the popup                                                                                                                                                                                |
| persist                     | boolean       | false                         | If true, the popup will be mounted in DOM and hidden / shown via CSS                                                                                                                                                                |
| position                    | PopupPosition | PopupPosition.BOTTOM          | Defines the position of the popup                                                                                                                                                                                                   |
| popupStyle                  | object        | undefined                     | Styles for popup                                                                                                                                                                                                                    |
| parentNode                  | DOM Node      | immediate Popup wrapped child | An optional DOM node to serve as the popup parent container, if undefined, the immediate child wrapped with Popup will serve as the parent container. You MUST define this prop if the immediate child of Popup is a React Fragment |
| zIndex                      | number        | 3                             | Z-index for popup                                                                                                                                                                                                                   |
| forcePosition               | boolean       | false                         | If true, turns off checking for in view port rendering                                                                                                                                                                              |
| animationDuration           | number        | 500                           | Animation duration in ms                                                                                                                                                                                                            |
| bufferX                     | number        | 25                            | The amount of pixel added as buffer when calculating the x-direction in view port constrain                                                                                                                                         |
| bufferY                     | number        | 25                            | The amount of pixel added as buffer when calculating the y-direction in view port constrain                                                                                                                                         |
| CustomPopupContentContainer | Component     | PopupContentContainer         | Defines the popup component                                                                                                                                                                                                         |

## Popup Methods

Below are the methods available to control the popup

| Method            | Args                        | Description                       |
| ----------------- | --------------------------- | --------------------------------- |
| showPopup         | none                        | Displays the popup                |
| closePopup        | none                        | Closes the popup                  |
| togglePopup       | none                        | Toggles the state of the popup    |
| setDynamicContent | Component \| Func Component | Updates the contents of the popup |

## Helper Functions

The below functions may be useful when trying to define custom popup positions:

-   **extractDOMRect**: Takes the result of `node.getBoundingClientRect` as input and outputs a corresponding js object
-   **computeCenterPosition**: `function(popupSize: extractDOMRect, parentSize: extractDOMRect) => { x: number, y: number }`. This function takes the two node sizes, and returns the x, y coordinates such that the 1st node are centered with respect to the 2nd node in the x and/or y direction

```javascript
//anchorNode is somewhere else on the page, not referring to the immediate child that Popup wrapped around
const anchorNodeSize = extractDOMRect(someNode.getBoundingClientRect());
const customPositionFn = ({ popupSize }) => {
    const { x } = computeCenterPosition(popupSize, anchorNodeSize);
    //Horizontally centers popup with respect to anchor element
    return `${x}px`;
};
<Popup
    position={PopupPosition.CUSTOM({
        left: customPositionFn,
    })}
>
    ...
</Popup>;
```
