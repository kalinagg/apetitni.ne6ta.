import { SnackbarState, SnackbarActionTypes, OPEN_SNACKBAR, CLOSE_SNACKBAR } from '../constants/types';

const initialSnackbarState: SnackbarState = {
    open: false,
    severity: 'error',
    message: '',
    undo: false
}

const snackbarReducer = (state = initialSnackbarState, action: SnackbarActionTypes) => {
    switch (action.type) {
        case OPEN_SNACKBAR:
            return ({
                ...state,
                open: true,
                severity: action.severity,
                message: action.message
            });
        case CLOSE_SNACKBAR:
            return ({
                ...state,
                open: false
            });
        default:
            return state;      
    }
}

export default snackbarReducer;