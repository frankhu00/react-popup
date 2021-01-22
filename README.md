# React Popup

A simple `react` + `styled-components` popup

## Package Interface

Named exports: `Popup`, `usePopupContext`, `PopupPosition`, `PopupContainer`, and `PopupContentContainer`  
Default export: `Popup`

## Usages

### 1) Pass in a function as children to access popup methods

```javascript
<Popup content={() => <div>Popup Content</div>}>
    {({ showPopup }) => <button onClick={showPopup}>Button to trigger popup</button>}
</Popup>
```

### 2) Popup methods are passed to the direct descendant

```javascript
const SampleButton = ({ showPopup }) => {
    return <button onClick={showPopup}>Sample Button</button>;
};

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

Pass in the option to the `position` prop. The position of the popup are by default adjusted to fit in view, when popups are determined to be going out of view
with the specified position, the component will auto-adjust the position of the popup so that it stays in view. To turn this feature off, do `forcePosition={true}`.

## Custom Popup Positions (WIP)

You can specify custom position by passing in an object of the form

```javascript
const position = {
    top: number || string,
    bottom: number || string,
    left: number || string,
    right: number || string,
    xCenter: boolean, //centers in the x-direction
    yCenter: boolean, //centers in the y-direction
};
```

If the properties are strings, it must include a valid CSS unit, I.E "100px", "100%", etc
If the properties are numbers (denoted N), it will be translated to `N*100 + "%"`, that is, 0.2 will be translated to 20%.

## Popup Props

| Prop                        | Type          | Default               | Description                                                                                                                                   |
| --------------------------- | ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| --------------------------- | ------------- | --------------------- | -------------------------------------------------------------------------------------------                                                   |
| content                     | Component     | undefined             | A component or function that returns a component to serve as the popup content                                                                |
| onPopupShow                 | func          | undefined             | Function to trigger when the popup is shown                                                                                                   |
| onPopupClose                | func          | undefined             | Function to trigger when the popup is closed                                                                                                  |
| showOnRender                | boolean       | false                 | If true, popup will display when mounted                                                                                                      |
| closeOnOffClick             | boolean       | true                  | If true, clicking off the popup will close the popup                                                                                          |
| persist                     | boolean       | false                 | If true, the popup will be mounted in DOM and hidden / shown via CSS                                                                          |
| position                    | PopupPosition | PopupPosition.BOTTOM  | Defines the position of the popup                                                                                                             |
| popupType                   | PopupType     | PopupType.ABSOLUTE    | Uses `position: absolute;`. Use `PopupType.FIXED` for `position: fixed`. This is useful when the popup needs to be fixed for styling purposes |
| popupStyle                  | object        | undefined             | Styles for popup                                                                                                                              |
| zIndex                      | number        | 3                     | Z-index for popup                                                                                                                             |
| forcePosition               | boolean       | false                 | If true, turns off checking for in view port rendering                                                                                        |
| animationDuration           | number        | 500                   | Animation duration in ms                                                                                                                      |
| bufferX                     | number        | 25                    | The amount of pixel added as buffer when calculating the x-direction in view port constrain                                                   |
| bufferY                     | number        | 25                    | The amount of pixel added as buffer when calculating the y-direction in view port constrain                                                   |
| CustomPopupContainer        | Component     | PopupContainer        | Defines the component that warps around the entire popup-able component                                                                       |
| CustomPopupContentContainer | Component     | PopupContentContainer | Defines the popup component                                                                                                                   |

## Popup Methods

Below are the methods available to control the popup

| Method                 | Args                        | Description                       |
| ---------------------- | --------------------------- | --------------------------------- |
| showPopup              | none                        | Displays the popup                |
| closePopup             | none                        | Closes the popup                  |
| togglePopup            | none                        | Toggles the state of the popup    |
| setDynamicContent      | Component \| Func Component | Updates the contents of the popup |
| updateOptions          | { ...WIP }                  | Updates the specified option      |
| updateCustomComponents | { ...WIP }                  | Updates the custom components     |

## Additional Notes
