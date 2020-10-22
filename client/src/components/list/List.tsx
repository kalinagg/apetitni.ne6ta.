import React from 'react';
import Thumbnail from '../thumbnail/Thumbnail';
import IRecipe from '../recipe/IRecipe';
import './List.scss';

interface IListProps {
    recipes: IRecipe[];
    selectRecipe(id: string): IRecipe;
}

const List = (props: IListProps) =>
    <div className="recipe-list-container">
        {props.recipes.map(r => (<Thumbnail 
            key={r.id}
            recipe={r}
            selectRecipe={props.selectRecipe} />))}
    </div>

export default List;