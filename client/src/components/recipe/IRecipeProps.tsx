import React from 'react';
import IRecipe from './IRecipe';

export default interface IRecipeProps {
    classes: any;
    upsertRecipe(recipe: IRecipe): Promise<string>;
    updateRecipeId(recipeId: string): void;
    // deleteRecipe(id: string): Promise<void>
    selectedRecipe: IRecipe;
}