import { combineReducers } from 'redux';
import recipesReducer from './recipesReducer';
import snackbarReducer from './snackbarReducer';

const rootReducer = combineReducers({
    recipesReducer,
    snackbarReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;