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
        this.showRecipeDetail = this.showRecipeDetail.bind(this);
        this.showRecipeList = this.showRecipeList.bind(this);
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

    updateRecipeById(recipe: IRecipe, recipes: IRecipe[]) {
        const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

        if (recipeIndex < 0) {
            throw new Error("Recipe not found:" + recipe.id);
        }

        const newRecipe = Object.assign({}, recipe);
        
        const newRecipes = [...recipes];
        newRecipes.splice(recipeIndex, 1, newRecipe);

        return newRecipes;
    }    

    saveRecipes(recipes: IRecipe[]): Promise<void> {
        return fetch('./recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(recipes)
        }).then(r => { console.log(r.statusText) });
    }

    handleSubmit(event: React.FormEvent<HTMLElement>, recipe: IRecipe): void {
        const newRecipes = this.updateRecipeById(
            recipe,
            this.state.recipes
        );

        // this.toggleEditMode(event);
        this.saveRecipes(newRecipes).then(() => {
            this.setState({
                recipes: newRecipes
            });
        });
    }

    deleteRecipeById(recipeId: number, recipes: IRecipe[]) {
        return recipes.filter(r => r.id !== recipeId);
    }

    handleDelete(recipeId: number, event: any): void {
        const newRecipes = this.deleteRecipeById(
            recipeId,
            this.state.recipes
        );

        this.setState({
            recipes: newRecipes
        });

        this.showRecipeList();
        
        this.saveRecipes(newRecipes);

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

    showRecipeDetail(recipe: IRecipe): void {
        this.setListView();
        this.selectedRecipe = recipe;
    }

    showRecipeList(): void {
        this.setListView();
    }

    setListView(): void {
        this.setState({
            listView: !this.state.listView
        });
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
                            showRecipeDetail={this.showRecipeDetail} />
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
                <Header
                    listView={this.state.listView}
                    showRecipeList={this.showRecipeList}
                    handleAddRecipe={this.handleAddRecipe} />
                {currentView}              
            </React.Fragment>
        )
    }
}