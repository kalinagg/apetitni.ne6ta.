import React, {Component} from 'react';
import {Route, matchPath} from 'react-router-dom';
import HeaderWithRouter from '../header/Header';
import Recipe from '../recipe/Recipe';
import IRecipe from '../recipe/IRecipe';
import RecipeThumbnail from '../recipe-thumbnail/RecipeThumbnail';
import SnackbarMessage, {SnackbarSeverity, Severity} from '../snackbar/SnackbarMessage';
import IRecipeList from './IRecipeList';
import history from '../history';
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
        // this.deleteRecipe = this.deleteRecipe.bind(this);
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

    async saveRecipe(event: React.FormEvent<HTMLElement>, recipe: IRecipe): Promise<void> {
        const {recipes} = this.state;
        const isRecipeNew = recipe.id === '';

        if (isRecipeNew) {
            let newRecipe = {...recipe};
            const newRecipes = [newRecipe, ...recipes];

            this.setState({
                recipes: newRecipes
            });

            newRecipe.id = await recipeManagerClient.upsertRecipe(newRecipe);
            history.push(`/recipe/${newRecipe.id}`);

        } else {
            const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

            if (recipeIndex < 0) {
                throw new Error('Recipe not found:' + recipe.id);
            }

            const newRecipe = {...recipe};
            const newRecipes = [...recipes];
            newRecipes.splice(recipeIndex, 1, newRecipe);

            this.setState({
                recipes: newRecipes
            });

            await recipeManagerClient.upsertRecipe(newRecipe);
        }        
    }

//     updateRecipeById(recipe: IRecipe, recipes: IRecipe[]) {
//         const recipeIndex = recipes.findIndex(r => r.id === recipe.id);

//         if (recipeIndex < 0) {
//             throw new Error('Recipe not found:' + recipe.id);
//         }

//         const newRecipe = {...recipe};
//         const newRecipes = [...recipes];
//         newRecipes.splice(recipeIndex, 1, newRecipe);

//         return newRecipes;
//    }    

    // async deleteRecipe(recipeId: number, event: any): Promise<void> {
    //     const newRecipes = this.deleteRecipeById(
    //         recipeId,
    //         this.state.recipes
    //     );

    //     this.setState({
    //         recipes: newRecipes
    //     });

    //     this.submitRecipes(newRecipes, 'Recipe removed!', true);
    // }

    // deleteRecipeById(recipeId: number, recipes: IRecipe[]) {
    //     return recipes.filter(r => r.id !== recipeId);
    // }

    async addRecipe(): Promise<void> {
        const newRecipe = {
            id: '',
            title: '',
            instructions: '',
            img: 'img-food/default.jpg',
            ingredients: ''
        };
        
        this.setState({
            recipes: [newRecipe, ...this.state.recipes]
        });
        
        // newRecipe.id = await recipeManagerClient.upsertRecipe(newRecipe);
        // history.push(`/recipe/${newRecipe.id}`);
    }
    
    getRecipeById(id: string): IRecipe {
        const found = this.state.recipes.filter(r => r.id == id); // todo: use ===

        if (!found.length) {
            throw new Error(`Recipe not found: ${id}.`);
        }

        return found[0];
    }
        
    matchPath;

    getRecipeIdFromUrl(pathname: string): string {
        this.matchPath = matchPath(pathname, {path: `/recipe/:id`});
        return this.matchPath && this.matchPath.params.id;
    }

    render() {
        const {error, isLoaded} = this.state;
        
        if (error) {
            return <div>Error: {error.message}</div>;
        }
        
        if (!isLoaded) {
            return <div>Loading ...</div>
        }
        
        // const recipe = this.getRecipeById() === undefined ? this.state.recipes[0] : this.getRecipeById();

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
                        // deleteRecipe={this.deleteRecipe}
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