import React from 'react';
import Thumbnail from '../thumbnail/Thumbnail';
import './List.scss';
import { IRecipe, RootState } from '../../types';
import { connect } from 'react-redux';

interface IListProps {
    recipes: IRecipe[] | undefined;
}

const List = (props: IListProps) =>
    <div className="recipe-list-container">
        {props.recipes ? props.recipes.map(r => (<Thumbnail key={r.id} recipe={r} />)) : <div></div>}
    </div>

const mapStateToProps = (state: RootState) => ({
    recipes: state.recipesState.recipes
});
  
const ConnectedList = connect(mapStateToProps)(List);

export default ConnectedList;