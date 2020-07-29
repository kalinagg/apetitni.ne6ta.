import React, {Component} from 'react';
import {Route, matchPath} from 'react-router-dom';
import Header from '../header/Header';
import Recipe from '../recipe/Recipe';
import IRecipe from '../recipe/IRecipe';
import RecipeThumbnail from '../recipe-thumbnail/RecipeThumbnail';
import SnackbarMessage, {SnackbarSeverity, Severity} from '../snackbar/SnackbarMessage';
import IRecipeList from './IRecipeList';
import history from '../history';
import './RecipeList.scss';

export default class RecipeList extends Component<any, IRecipeList> {
    constructor(props: any) {
        super(props);
        
        this.state = {
            isLoaded: false,
            recipes: [],
            snackbarOpen: false, 
            snackbarSeverity: SnackbarSeverity.Error,
            snackbarMessage: '',
            snackbarUndo: false
        };

        this.saveRecipes = this.saveRecipes.bind(this);      
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.addRecipe = this.addRecipe.bind(this);        
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

    async submitRecipes(recipes: IRecipe[], snackbarMessage: string, snackbarUndo: boolean): Promise<void> {
        try {
            const response = await fetch('/recipes', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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

    saveRecipes(event: React.FormEvent<HTMLElement>, recipe: IRecipe): void {
        const newRecipes = this.updateRecipeById(
            recipe,
            this.state.recipes
        );

        this.setState({
            recipes: newRecipes
        });

        this.submitRecipes(newRecipes, 'Recipe saved!', false);
    }

    updateRecipeById(recipe: IRecipe, recipes: IRecipe[]) {
        const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

        if (recipeIndex < 0) {
            throw new Error('Recipe not found:' + recipe.id);
        }

        const newRecipe = {...recipe};
        const newRecipes = [...recipes];
        newRecipes.splice(recipeIndex, 1, newRecipe);

        return newRecipes;
   }    

    async deleteRecipe(recipeId: number, event: any): Promise<void> {
        const newRecipes = this.deleteRecipeById(
            recipeId,
            this.state.recipes
        );

        this.setState({
            recipes: newRecipes
        });

        await this.submitRecipes(newRecipes, 'Recipe removed!', true);
    }

    deleteRecipeById(recipeId: number, recipes: IRecipe[]) {
        return recipes.filter(r => r.id !== recipeId);
    }

    addRecipe(): void {
        const {recipes} = this.state;
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

        history.push(`/recipe/${newRecipe.id}`);
    }
    
    getRecipeById(): IRecipe {
        return this.state.recipes.filter(
            r => r.id === this.getUrlParams(this.props.location.pathname))[0]; 
        }
        
    matchPath;

    getUrlParams(pathname: string): number {
        this.matchPath = matchPath(pathname, {path: `/recipe/:id`});

        return this.matchPath && + this.matchPath.params.id;
    }

    render() {
        const {error, isLoaded} = this.state;
        let recipe: IRecipe;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        
        if (!isLoaded) {
            return <div>Loading ...</div>
        }
        
        recipe = this.getRecipeById();

        return (
            <React.Fragment>
                <Header                    
                    matchPath={this.matchPath}
                    recipe={recipe}
                    addRecipe={this.addRecipe} />
                <Route exact path="/">
                    <div className="recipe-list-container">
                        {this.state.recipes.map(r => (
                            <RecipeThumbnail key={r.id} recipe={r} />
                        ))}
                    </div>
                </Route>                                       
                <Route path="/recipe/:id">
                    <Recipe                        
                        recipe={recipe}
                        saveRecipes={this.saveRecipes}
                        deleteRecipe={this.deleteRecipe} />
                </Route>
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