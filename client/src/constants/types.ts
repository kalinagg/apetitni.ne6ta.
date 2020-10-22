import IRecipe from '../components/recipe/IRecipe';

export const SHOW_RECIPES  = 'SHOW_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';
export const SAVE_RECIPE = 'SAVE_RECIPE';
export const UPDATE_RECIPE_ID = 'UPDATE_RECIPE_ID';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export interface RecipeState {
    isLoaded: boolean;
    recipes: IRecipe[];
    selectedRecipe: IRecipe;
}

export interface ShowRecipesAction {
    type: typeof SHOW_RECIPES;
    recipes: IRecipe[];
}

export interface SelectRecipeAction {
    type: typeof SELECT_RECIPE;
    recipeId: string;
}

export interface SaveRecipeAction {
    type: typeof SAVE_RECIPE;
    recipe: IRecipe;
}

export interface UpdateRecipeIdAction {
    type: typeof UPDATE_RECIPE_ID;
    recipeId: string;
}

export interface DeleteRecipeAction {
    type: typeof DELETE_RECIPE;
    recipeId: string;
}

export type RecipeActionTypes = 
    ShowRecipesAction | SelectRecipeAction | SaveRecipeAction | UpdateRecipeIdAction | DeleteRecipeAction;

export type Severity = 'success' | 'error';

export interface SnackbarState {
    open: boolean;
    severity: Severity;
    message: string;
    undo: boolean;
}

export interface OpenSnackbarAction {
    type: typeof OPEN_SNACKBAR;
    severity: Severity;
    message: string;
}

export interface CloseSnackbarAction {
    type: typeof CLOSE_SNACKBAR;
}

export type SnackbarActionTypes = OpenSnackbarAction | CloseSnackbarAction;