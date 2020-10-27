import { combineReducers } from 'redux';
import { RootState } from '../types';
import recipesReducer from './recipesReducer';
import snackbarReducer from './snackbarReducer';

const rootReducer = combineReducers<RootState>({
    recipesState: recipesReducer,
    snackbarState: snackbarReducer
});

export default rootReducer;