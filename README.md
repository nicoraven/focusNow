# focusNow
A Chrome extension that brings a focused to-do app to the newtab


## Installation

```
git clone https://github.com/nicoraven/focusNow.git
```
Go to `focusnow-chrome-extension` directory and run

```
yarn install
```

### Adding extension to Chrome manually

1. Build the extension using
```
yarn build
```

2. In Google Chrome, open the Extension Management page by navigating to chrome://extensions.
	* The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.

3. Enable Developer Mode by clicking the toggle switch next to `Developer mode`.

4. Click the `Load unpacked` button and select the /extension/build directory. (Select the entire folder)

5. Open a new tab to see the extension at work.