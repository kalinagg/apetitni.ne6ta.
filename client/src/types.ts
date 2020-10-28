export const RECEIVE_RECIPES  = 'RECEIVE_RECIPES';
export const SELECT_RECIPE = 'SELECT_RECIPE';
export const SAVE_RECIPE = 'SAVE_RECIPE';
export const UPDATE_RECIPE_ID = 'UPDATE_RECIPE_ID';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export interface IRecipe {
    id: string;
    ingredients: string;
    title: string;
    img: string;
    instructions: string;
    isUploading?: boolean;
    isEditMode?: boolean;
}

export interface RootState {
    recipesState: RecipeState;
    snackbarState: SnackbarState;
}

export interface RecipeState {
    recipesLoaded: boolean;
    recipes: IRecipe[];
    selectedRecipe: IRecipe | undefined;
}

export interface ReceiveRecipesAction {
    type: typeof RECEIVE_RECIPES;
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
    ReceiveRecipesAction | SelectRecipeAction | SaveRecipeAction | UpdateRecipeIdAction | DeleteRecipeAction;

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