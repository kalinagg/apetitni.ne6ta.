import * as types from '../constants/types';
import IRecipe from '../components/recipe/IRecipe';
import RecipeManagerClient from '../helpers/RecipeManagerClient';

// Thumbnail
export const selectRecipe = (recipeId : string): types.SelectRecipeAction => ({
    type: types.SELECT_RECIPE,
    recipeId
});

// RecipeList
export const showRecipes = (recipes: IRecipe[]): types.ShowRecipesAction => ({
    type: types.SHOW_RECIPES,
    recipes
});

export const saveRecipe = (recipe: IRecipe): types.SaveRecipeAction => ({
    type: types.SAVE_RECIPE,
    recipe
});

export const updateRecipeId = (recipeId: string): types.UpdateRecipeId => ({
    type: types.UPDATE_RECIPE_ID,
    recipeId
});

export const addRecipe = recipe => ({type: types.ADD_RECIPE, recipe});
export const deleteRecipe = recipe => ({type: types.DELETE_RECIPE, recipe});
export const openSnackbar = snackbar => ({type: types.OPEN_SNACKBAR, snackbar});
export const closeSnackbar = snackbar => ({type: types.CLOSE_SNACKBAR, snackbar});

// Recipe
export const updateTitle = text => ({type: types.UPDATE_TITLE, text});
export const updateIngredients = text => ({type: types.UPDATE_INGREDIENTS, text});
export const updateInstructions = text => ({type: types.UPDATE_INSTRUCTIONS, text});
export const uploadImage = image => ({type: types.UPLOAD_IMAGE, image});
export const cancel = recipe => ({type: types.CANCEL, recipe});
export const edit = recipe => ({type: types.EDIT, recipe});
export const save = recipe => ({type: types.SAVE, recipe});

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
            dispatch(saveRecipe(recipe));
            return await recipeManagerClient.upsertRecipe(recipe);
        } catch(err) {
            console.log(err);
        }
    }
}