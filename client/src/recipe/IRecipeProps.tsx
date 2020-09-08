import React from 'react';
import IRecipe from './IRecipe';

export default interface IRecipeProps {
    // recipe: IRecipe;
    classes: any;
    saveRecipe(event: React.FormEvent<HTMLElement>, recipe: IRecipe): Promise<void>;
    // deleteRecipe(recipeId: number, event: any): void;
    getRecipeById(id: string): IRecipe;
}