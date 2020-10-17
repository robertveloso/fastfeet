import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'fominha',
      storage,
      whitelist: ['auth', 'user', 'cart'],
    },
    reducers
  );

  return persistedReducer;
};
