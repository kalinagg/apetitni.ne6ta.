import React, { Component } from 'react';
import Recipe, { IRecipe } from './Recipe';
import Header from '../header/Header';
import RecipeThumbnail from './RecipeThumbnail';
import './RecipeList.scss';
import SnackbarMessage from '../snackbar/SnackbarMessage';

enum SnackbarSeverity {
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
}

export type Severity = 'success' | 'info' | 'warning' | 'error';

export interface IRecipeList {
    error?: { message: string };
    isLoaded: boolean;
    recipes: IRecipe[];
    listView: boolean;
    snackbarOpen: boolean;
    snackbarSeverity: Severity;
    snackbarMessage: string;
    snackbarUndo: boolean;
}

export default class RecipeList extends Component<any, IRecipeList> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            isLoaded: false,
            recipes: [],
            listView: true,
            snackbarOpen: false, 
            snackbarSeverity: SnackbarSeverity.Error,
            snackbarMessage: '',
            snackbarUndo: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);        
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddRecipe = this.handleAddRecipe.bind(this);        
        this.showRecipeDetail = this.showRecipeDetail.bind(this);
        this.showRecipeList = this.showRecipeList.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
    }

    componentDidMount() {
        this.getRecipes();
    }

    async getRecipes(): Promise<void> {
        try {
            const response = await fetch('/recipes');
            const recipes = await response.json();

            this.setState({
                isLoaded: true,
                recipes
            });        
        } catch(error) {        
            this.setState({
                isLoaded: true,
                error
            });
        }
    }

    updateRecipeById(recipe: IRecipe, recipes: IRecipe[]) {
        const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

        if (recipeIndex < 0) {
            throw new Error('Recipe not found:' + recipe.id);
        }

        const newRecipe = Object.assign({}, recipe);
        
        const newRecipes = [...recipes];
        newRecipes.splice(recipeIndex, 1, newRecipe);

        return newRecipes;
    }    

    async saveRecipes(recipes: IRecipe[], snackbarMessage: string, snackbarUndo: boolean): Promise<void> {
        try {
            const response = await fetch('/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recipes)
            });

            if(!response.ok) {
                throw new Error('Something went wrong, please try again later!');
            }

            this.openSnackbar(SnackbarSeverity.Success, snackbarMessage, snackbarUndo);
        } catch(error) {
            this.openSnackbar(SnackbarSeverity.Error, error.message, false);
        }
    }

    openSnackbar(severity: Severity, message: string, undo: boolean) {
        this.setState({
            snackbarOpen: true,
            snackbarSeverity: severity,
            snackbarMessage: message,
            snackbarUndo: undo
        });
    }

    closeSnackbar() {    
        this.setState({
            snackbarOpen: false
        }); 
    }

    async handleSubmit(event: React.FormEvent<HTMLElement>, recipe: IRecipe): Promise<void> {
        const newRecipes = this.updateRecipeById(
            recipe,
            this.state.recipes
        );

        this.setState({
            recipes: newRecipes
        });

        // this.toggleEditMode(event);
        await this.saveRecipes(newRecipes, 'Recipe is saved!', false);
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
        this.saveRecipes(newRecipes, 'Recipe is removed!', true);
    }

    selectedRecipe: any = {};

    handleAddRecipe(): void {
        const recipes = this.state.recipes;

        const newRecipe = {
            id: recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
            title: '',
            instructions: '',
            img: 'img-food/default.jpg',
            ingredients: []
        };

        this.setState({
            recipes: [
                newRecipe,
                ...recipes]
        });

        this.showRecipeDetail(newRecipe);
    }

    showRecipeDetail(recipe: IRecipe): void {
        this.setDetailView();
        this.selectedRecipe = recipe;
    }

    showRecipeList(): void {
        this.setListView();
    }

    setListView(): void {
        this.setState({
            listView: true
        });
    }

    setDetailView(): void {
        this.setState({
            listView: false
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
                <SnackbarMessage
                    open={this.state.snackbarOpen}
                    severity={this.state.snackbarSeverity}
                    message={this.state.snackbarMessage}
                    undo={this.state.snackbarUndo}
                    closeSnackbar={this.closeSnackbar} />
            </React.Fragment>
        )
    }
}