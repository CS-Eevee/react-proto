import logger from 'redux-logger';
import throttle from 'lodash.throttle';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { saveState } from './localStorage';

let composer;

const stateSanitizer = (state) => {
  const { components, focusComponent } = state;
  let slimComponents = [];
  let slimFocusComponent = {};

  if (focusComponent) {
    slimFocusComponent = { ...focusComponent, parent: '<<OBJ_REF>>', children: '<<OBJ_REF>>' };
  }

  if (components) {
    slimComponents = components.map(component => (
      { ...component, parent: '<<OBJ_REF>>', children: '<<OBJ_REF>>' }
    ));
  }
  return { ...state, components: slimComponents, focusComponent: slimFocusComponent };
};


if (process.env.NODE_ENV === 'development') {
  composer = composeWithDevTools({
    maxAge: 20,
    serialize: false,
    stateSanitizer,
  });
  composer = composer(applyMiddleware(logger, thunk));
} else {
  composer = compose(applyMiddleware(thunk));
}

const store = createStore(
  reducers,
  composer,
);

store.subscribe(throttle(() => saveState(store.getState()), 1000));

export default store;
