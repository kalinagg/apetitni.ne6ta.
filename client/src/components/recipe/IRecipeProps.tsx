import React from 'react';
import IRecipe from './IRecipe';

export default interface IRecipeProps {
    classes: any;
    selectedRecipe: IRecipe;
    upsertRecipe(recipe: IRecipe): Promise<string>;
    updateRecipeId(recipeId: string): void;
    deleteRecipe(recipeId: string): Promise<void>;
}