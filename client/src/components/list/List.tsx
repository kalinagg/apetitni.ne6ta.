import React from 'react';
import Thumbnail from '../thumbnail/Thumbnail';
import IRecipe from '../recipe/IRecipe';
import './List.scss';

interface IList {
    recipes: IRecipe[];
    selectRecipe(id: string): IRecipe;
}

const List = (props: IList) => {
    const {recipes, selectRecipe} = props;

    return (
        <div className="recipe-list-container">
            {recipes.map(r => (<Thumbnail 
                key={r.id}
                recipe={r}
                selectRecipe={selectRecipe} />))}
        </div>
    )
}

export default List;
