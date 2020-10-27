import * as types from '../types';
import IRecipe from '../components/recipe/IRecipe';
import RecipeManagerClient from '../helpers/RecipeManagerClient';

export const selectRecipe = (recipeId : string): types.SelectRecipeAction => ({
    type: types.SELECT_RECIPE,
    recipeId
});

export const receiveRecipes = (recipes: IRecipe[]): types.ReceiveRecipesAction => ({
    type: types.RECEIVE_RECIPES,
    recipes
});

export const saveRecipe = (recipe: IRecipe): types.SaveRecipeAction => ({
    type: types.SAVE_RECIPE,
    recipe
});

export const updateRecipeId = (recipeId: string): types.UpdateRecipeIdAction => ({
    type: types.UPDATE_RECIPE_ID,
    recipeId
});

export const deleteRecipe = (recipeId: string): types.DeleteRecipeAction => ({
    type: types.DELETE_RECIPE,
    recipeId
});

export const openSnackbarSuccess = (message: string): types.OpenSnackbarAction => ({
    type: types.OPEN_SNACKBAR,
    severity: 'success',
    message
});

export const openSnackbarError = (message: string): types.OpenSnackbarAction => ({
    type: types.OPEN_SNACKBAR,
    severity: 'error',
    message
});

export const closeSnackbar = (): types.CloseSnackbarAction => ({
    type: types.CLOSE_SNACKBAR
});

const recipeManagerClient = new RecipeManagerClient();

export const fetchRecipes = () => {
    return async dispatch => {
        try {
            const recipes = await recipeManagerClient.getRecipes();
            dispatch(receiveRecipes(recipes));
        } catch(err) {
            dispatch(openSnackbarError('Something went wrong. Please try again later.'));
        }
    }
}

export const upsertRecipe = recipe => {
    return async dispatch => {
        try {
            const recipeId = await recipeManagerClient.upsertRecipe(recipe);            
            dispatch(saveRecipe(recipe));
            dispatch(updateRecipeId(recipeId));
            dispatch(openSnackbarSuccess('Recipe saved.'));

            return recipeId;
        } catch(err) {            
            dispatch(openSnackbarError('Recipe could not be saved.'));
        }
    }
}

export const deleteRecipeFromServer = recipeId => {
    return async dispatch => {
        try {
            await recipeManagerClient.deleteRecipe(recipeId);
            dispatch(deleteRecipe(recipeId));
            dispatch(openSnackbarSuccess('Recipe deleted.'));
        } catch(err) {
            dispatch(openSnackbarError('Recipe could not be deleted.'));
        }
    }
}