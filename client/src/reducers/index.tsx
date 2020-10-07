import { combineReducers } from 'redux';
import recipesReducer from './recipesReducer';

const rootReducer = combineReducers({
    recipesReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;