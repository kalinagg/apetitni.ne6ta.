import { SHOW_RECIPES, SELECT_RECIPE, RecipeState, RecipeActionTypes } from '../constants/types';

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
        default:
            return state;
    }
}

export default recipesReducer;