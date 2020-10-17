import { createStore, compose, applyMiddleware } from 'redux';

export default (reducers, middlewares) => {
  const bindMiddleware = middleware => {
    if (process.env.NODE_ENV !== 'production') {
      const { composeWithDevTools } = require('redux-devtools-extension');
      return compose(
        console.tron.createEnhancer(),
        composeWithDevTools(applyMiddleware(...middleware))
      );
    }
    return applyMiddleware(...middleware);
  };

  return createStore(reducers, bindMiddleware(middlewares));
};
