import IRecipe from '../components/recipe/IRecipe';
import { SHOW_RECIPES, SELECT_RECIPE, RecipeState, RecipeActionTypes, SAVE_RECIPE, UPDATE_RECIPE_ID } from '../constants/types';

const initialState: RecipeState = {
    isLoaded: false,
    recipes: [],
    selectedRecipe: {
        id: '',
        ingredients: '',
        title: '',
        img: '',
        instructions: ''
    }
}

const recipesReducer = (state = initialState, action: RecipeActionTypes) => {
    switch (action.type) {
        case SHOW_RECIPES:
            return ({
                ...state,
                isLoaded: true,
                recipes: [...action.recipes]
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
        default:
            return state;
    }
}

export default recipesReducer;