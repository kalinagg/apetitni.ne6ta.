import { RECEIVE_RECIPES, SELECT_RECIPE, RecipesState, RecipeActionTypes, SAVE_RECIPE, UPDATE_RECIPE_ID, DELETE_RECIPE, IRecipe } from '../types';

const initialRecipesState: RecipesState = {
    recipesLoaded: false,
    recipes: [],
    selectedRecipe: undefined
}

const recipesReducer = (state = initialRecipesState, action: RecipeActionTypes) => {
    switch (action.type) {
        case RECEIVE_RECIPES:
            return ({
                ...state,
                recipesLoaded: true,
                recipes: action.recipes
            });
        case SELECT_RECIPE:
            const selectedRecipe = state.recipes.filter(r => r.id === action.recipeId)[0];
            return ({
                ...state,
                selectedRecipe
            });
        case SAVE_RECIPE:
            const isRecipeNew = action.recipe.id === '';
            let savedRecipes: IRecipe[];
            
            if (isRecipeNew) {
                savedRecipes = [...state.recipes, action.recipe];
            } else {
                const recipeIndex = state.recipes.findIndex(r => r.id === action.recipe.id);
                if (recipeIndex < 0) {
                    throw new Error('Recipe not found:' + action.recipe.id);
                }

                savedRecipes = [...state.recipes];
                savedRecipes.splice(recipeIndex, 1, action.recipe);
            }

            return ({
                ...state,
                recipes: savedRecipes
            });
        case UPDATE_RECIPE_ID:
            const recipeIndex = state.recipes.findIndex(r => r.id === '');
            if (recipeIndex < 0) {
                return state;
            }

            const updatedRecipe = state.recipes[recipeIndex];
            updatedRecipe.id = action.recipeId;

            const updatedRecipes = [...state.recipes];            
            updatedRecipes.splice(recipeIndex, 1, updatedRecipe);

            return ({
                ...state,
                recipes: updatedRecipes
            });
        case DELETE_RECIPE:
            if (typeof action.recipeId !== 'string') {
                throw new Error(`RecipeId should be a string and not ${typeof action.recipeId}.`);
            }

            const newRecipes = state.recipes.filter(r => r.id !== action.recipeId);

            return ({
                ...state,
                recipes: newRecipes
            });
        default:
            return state;
    }
}

export default recipesReducer;