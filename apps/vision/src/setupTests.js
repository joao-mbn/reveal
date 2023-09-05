// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import * as ResizeObserverModule from 'resize-observer-polyfill';

// mock createObjectURL for mapbox
window.URL.createObjectURL = () => '';

global.ResizeObserver = ResizeObserverModule.default;