import * as types from '../constants/types';
import IRecipe from '../components/recipe/IRecipe';
import RecipeManagerClient from '../helpers/RecipeManagerClient';

export const selectRecipe = (recipeId : string): types.SelectRecipeAction => ({
    type: types.SELECT_RECIPE,
    recipeId
});

export const showRecipes = (recipes: IRecipe[]): types.ShowRecipesAction => ({
    type: types.SHOW_RECIPES,
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

// export const openSnackbar = (severity: types.Severity, message: string): types.OpenSnackbarAction => ({
//     type: types.OPEN_SNACKBAR,
//     severity,
//     message
// });

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

// Recipe
// export const updateTitle = text => ({type: types.UPDATE_TITLE, text});
// export const updateIngredients = text => ({type: types.UPDATE_INGREDIENTS, text});
// export const updateInstructions = text => ({type: types.UPDATE_INSTRUCTIONS, text});
// export const uploadImage = image => ({type: types.UPLOAD_IMAGE, image});
// export const cancel = recipe => ({type: types.CANCEL, recipe});
// export const edit = recipe => ({type: types.EDIT, recipe});
// export const save = recipe => ({type: types.SAVE, recipe});

const recipeManagerClient = new RecipeManagerClient();

export const fetchRecipes = () => {
    return async dispatch => {
        try {
            const recipes = await recipeManagerClient.getRecipes();
            dispatch(showRecipes(recipes));
        } catch(err) {
            console.log(err);
        }
    }
}

export const upsertRecipe = recipe => {
    return async dispatch => {
        try {
            const recipeId = await recipeManagerClient.upsertRecipe(recipe);            
            dispatch(saveRecipe(recipe));
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