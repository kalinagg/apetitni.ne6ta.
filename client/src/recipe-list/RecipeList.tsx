import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import HeaderWithRouter from '../header/Header';
import Recipe from '../recipe/Recipe';
import IRecipe from '../recipe/IRecipe';
import RecipeThumbnail from '../recipe-thumbnail/RecipeThumbnail';
import SnackbarMessage, {SnackbarSeverity, Severity} from '../snackbar/SnackbarMessage';
import IRecipeList from './IRecipeList';
import history from '../history';
import newRecipeImageUrl from '../new-recipe.jpg'
import './RecipeList.scss';

import RecipeManagerClient from '../RecipeManagerClient';
const recipeManagerClient = new RecipeManagerClient();

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

        this.saveRecipe = this.saveRecipe.bind(this);      
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.addRecipe = this.addRecipe.bind(this);        
        // this.closeSnackbar = this.closeSnackbar.bind(this);
        this.getRecipeById = this.getRecipeById.bind(this);
    }

    componentDidMount() { 
        this.showRecipes();
    }

    async showRecipes(): Promise<void> {
        this.setState({
            isLoaded: true,
            recipes: await recipeManagerClient.getRecipes()
        });
    }

    // openSnackbar(severity: Severity, message: string, undo: boolean) {
    //     this.setState({
    //         snackbarOpen: true,
    //         snackbarSeverity: severity,
    //         snackbarMessage: message,
    //         snackbarUndo: undo
    //     });
    // }

    // closeSnackbar() {   
    //     this.setState({
    //         snackbarOpen: false
    //     }); 
    // }

    async saveRecipe(recipe: IRecipe): Promise<void> {
        const {recipes} = this.state;
        const isRecipeNew = recipe.id === '';

        if (isRecipeNew) {
            recipe.id = await recipeManagerClient.upsertRecipe(recipe);
            const newRecipes = [recipe, ...recipes];

            this.setState({
                recipes: newRecipes
            });

            history.push(`/recipe/${recipe.id}`);
            return;
        }
        
        const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

        if (recipeIndex < 0) {
            throw new Error('Recipe not found:' + recipe.id);
        }

        await recipeManagerClient.upsertRecipe(recipe);

        const newRecipe = {...recipe};
        const newRecipes = [...recipes];
        newRecipes.splice(recipeIndex, 1, newRecipe);

        this.setState({
            recipes: newRecipes
        });
    }

    
    async addRecipe(): Promise<void> {
        const newRecipe = {
            id: '',
            title: '',
            instructions: '',
            img: newRecipeImageUrl,
            ingredients: ''
        };
        
        this.setState({
            recipes: [newRecipe, ...this.state.recipes]
        });
    }
    
    async deleteRecipe(id: string): Promise<void> {
        if (typeof id !== 'string') {
            throw new Error(`RecipeId should be a string and not ${typeof id}`);
        }

        await recipeManagerClient.deleteRecipe(id);

        const newRecipes = this.state.recipes.filter(r => r.id !== id);
        this.setState({
            recipes: newRecipes
        });

        history.push('/');
    }

    getRecipeById(id: string): IRecipe {
        const found = this.state.recipes.filter(r => r.id === id);

        if (!found.length) {
            throw new Error(`Recipe not found: ${id}.`);
        }

        return found[0];
    }

    render() {
        const {error, isLoaded} = this.state;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        
        if (!isLoaded) {
            return <div>Loading ...</div>
        }
        
        return (
            <React.Fragment>
                <HeaderWithRouter />                   
                <Route exact path="/">
                    <div className="recipe-list-container">
                        {this.state.recipes.map(r => (
                            <RecipeThumbnail key={r.id} recipe={r} />
                        ))}
                    </div>
                </Route>                                       
                <Route path="/recipe/:id" render={(props) => 
                    (<Recipe
                        {...props}
                        getRecipeById={this.getRecipeById}                     
                        saveRecipe={this.saveRecipe}
                        deleteRecipe={this.deleteRecipe}
                    />)}
                />                
                {/* <SnackbarMessage
                    open={this.state.snackbarOpen}
                    severity={this.state.snackbarSeverity}
                    message={this.state.snackbarMessage}
                    undo={this.state.snackbarUndo}
                    closeSnackbar={this.closeSnackbar} />                     */}
            </React.Fragment>
        )
    }
}