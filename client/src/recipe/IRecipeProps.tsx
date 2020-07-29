import React from 'react';
import IRecipe from './IRecipe';

export default interface IRecipeProps {
    recipe: IRecipe;
    classes: any;
    saveRecipes(event: React.FormEvent<HTMLElement>, recipe: IRecipe): void;
    deleteRecipe(recipeId: number, event: any): void;
}