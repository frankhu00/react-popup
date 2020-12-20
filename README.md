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
-   `BOTTOM`
-   `LEFT`
-   `RIGHT`
-   `TOP_LEFT`
-   `TOP_RIGHT`
-   `BOTTOM_LEFT`
-   `BOTTOM_RIGHT`

Pass in the option to the `position` prop. The position of the popup are by default adjusted to fit in view, when popups are determined to be going out of view
with the specified position, the component will auto-adjust the position of the popup so that it stays in view. To turn this feature off, do `forcePosition={true}`.

## Popup Props

WIP

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
