import React from 'react';
import IRecipe from './IRecipe';

export default interface IRecipeProps {
    classes: any;
    // saveRecipe(recipe: IRecipe): Promise<void>;
    // deleteRecipe(id: string): Promise<void>
    selectedRecipe: IRecipe;
}