import IRecipe from '../components/recipe/IRecipe';

// Thumbnail
export const SELECT_RECIPE = 'SELECT_RECIPE';

// RecipeList
export const SHOW_RECIPES  = 'SHOW_RECIPES';
export const SAVE_RECIPE = 'SAVE_RECIPE';
export const ADD_RECIPE = 'ADD_RECIPE';
export const DELETE_RECIPE = 'DELETE_RECIPE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const UPDATE_RECIPE_ID = 'UPDATE_RECIPE_ID';

// Recipe
export const UPDATE_TITLE = 'UPDATE_TITLE';
export const UPDATE_INGREDIENTS = 'UPDATE_INGREDIENTS';
export const UPDATE_INSTRUCTIONS = 'UPDATE_INSTRUCTIONS';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const CANCEL = 'CANCEL';
export const EDIT = 'EDIT';
export const SAVE = 'SAVE';

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

export interface UpdateRecipeId {
    type: typeof UPDATE_RECIPE_ID;
    recipeId: string;
}

export type RecipeActionTypes = ShowRecipesAction | SelectRecipeAction | SaveRecipeAction | UpdateRecipeId;