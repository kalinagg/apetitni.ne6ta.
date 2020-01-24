import React, { Component } from 'react';
import Recipe, { IRecipe } from './Recipe';
import Header from '../header/Header';
import RecipeThumbnail from './RecipeThumbnail';
import './RecipeList.scss';

export interface IRecipeList {
    error?: { message: string };
    isLoaded: boolean;
    recipes: IRecipe[];
    listView: boolean;
}

export default class RecipeList extends Component<any, IRecipeList> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            isLoaded: false,
            recipes: [],
            listView: true
        };

        this.handleSubmit = this.handleSubmit.bind(this);        
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddRecipe = this.handleAddRecipe.bind(this);        
        this.handleShowRecipe = this.handleShowRecipe.bind(this);
    }

    componentDidMount() {
        this.getRecipes();
    }

    getRecipes(): void {
        fetch('./recipes')
            .then(recipes => recipes.json())
            .then(
                recipes => {
                    this.setState({
                        isLoaded: true,
                        recipes
                    });
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    updateRecipeById(recipeId: number, recipes: IRecipe[], changeRecipe: (recipe: IRecipe) => void): IRecipe[] {
        const recipeIndex = recipes.findIndex(r => r.id === recipeId);

        if (recipeIndex < 0) {
            throw new Error("Recipe not found:" + recipeId);
        }

        const newRecipe = Object.assign({}, recipes[recipeIndex]);
        changeRecipe(newRecipe);

        const newRecipes = [...recipes];
        newRecipes.splice(recipeIndex, 1, newRecipe);

        return newRecipes;
    }

    deleteRecipeById(recipeId: number, recipes: IRecipe[]) {
        return recipes.filter(r => r.id !== recipeId);
    }

    saveRecipes(recipes: IRecipe[]): Promise<void> {
        return fetch('./recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipes)
        }).then(r => { console.log(r.statusText) });
    }

    handleSubmit(event: React.FormEvent<HTMLElement>): void {
        // this.toggleEditMode(event);
        this.saveRecipes(this.state.recipes);
    }

    handleDelete(recipeId: number, event: any): void {
        const newRecipes = this.deleteRecipeById(
            recipeId,
            this.state.recipes
        );

        this.saveRecipes(newRecipes).then(() => {
            this.setState({
                recipes: newRecipes
            });
        });
    }

    handleAddRecipe(): void {
        const recipes = this.state.recipes;

        const newRecipe = {
            id: recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
            title: '',
            instructions: '',
            img: 'img-food/default.jpg',
            ingredients: []
        }

        this.setState({
            recipes: [
                newRecipe,
                ...recipes]
        });
    }

    selectedRecipe: any = {};

    handleShowRecipe(recipe: IRecipe): void {
        this.setState({
            listView: false
        });

        this.selectedRecipe = recipe;
    }

    render() {
        const { error, isLoaded } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!isLoaded) {
            return <div>Loading ...</div>
        }

        let currentView;

        if(this.state.listView) {
            currentView = (
                <div className="recipe-list-container">
                    {this.state.recipes.map(r => (
                        <RecipeThumbnail
                            key={r.id}
                            recipe={r}
                            handleShowRecipe={this.handleShowRecipe} />
                    ))}
                </div>              
            );
        } else {
            currentView = (                
                <Recipe
                    recipe={this.selectedRecipe}
                    key={this.selectedRecipe.id} 
                    handleSubmit={this.handleSubmit}
                    handleDelete={this.handleDelete} />
            );
        }

        return (
            <React.Fragment>
                <Header handleAddRecipe={this.handleAddRecipe} />
                {currentView}              
            </React.Fragment>
        )
    }
}