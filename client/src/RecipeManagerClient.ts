import IRecipe from './recipe/IRecipe';

export default class RecipeManagerClient {
    async getRecipes(): Promise<IRecipe[]> {        
        const response = await fetch('/recipes');
        
        if(!response.ok) {
            throw new Error('Could not get recipes.');
        }

        return await response.json();
    }

    async upsertRecipe(recipe: IRecipe): Promise<string> {
        const add = recipe.id === '';
        const url = add ? '/recipes/add' : '/recipes/update';

        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipe)
        });

        if(!response.ok) {
            throw new Error('The recipe could not be saved.');
        }

        return add ? (await response.json()).id : recipe.id;
    }

    async deleteRecipe(recipeId: string) {
        const response = await fetch('/recipes/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipeId)
        });

        if(!response.ok) {
            throw new Error('Could not delete recipe.');
        }
    }
}