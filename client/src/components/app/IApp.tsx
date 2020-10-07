import IRecipe from '../recipe/IRecipe';
import {Severity} from '../snackbar/SnackbarMessage';

export default interface IApp {
    error?: {message: string};
    isLoaded: boolean;
    recipes: IRecipe[];
    snackbarOpen: boolean;
    snackbarSeverity: Severity;
    snackbarMessage: string;
    snackbarUndo: boolean;
}