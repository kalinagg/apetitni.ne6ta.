import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import history from '../../helpers/history';
import HeaderWithRouter from '../header/Header';
import Footer from '../footer/Footer';
import { fetchRecipes, selectRecipe, updateRecipeId, upsertRecipe } from '../../actions';
import { connect } from 'react-redux';
import Recipe from '../recipe/Recipe';
import List from '../list/List';
import IApp from './IApp';

class App extends Component<any, IApp> {
    componentDidMount() {
        const {recipes, fetchRecipes} = this.props;        
        fetchRecipes();        
    }

    render() {
        const {error, isLoaded, recipes, selectedRecipe, selectRecipe, upsertRecipe, updateRecipeId} = this.props;        
        
        return (
            <React.StrictMode>
                <Router history={history}>
                    <HeaderWithRouter />
                    <Switch>
                        <Route exact path="/">
                            <List recipes={recipes} selectRecipe={selectRecipe} />                    
                        </Route>  
                        <Route path="/recipe/:id" render={props =>                   
                            (<Recipe
                                {...props}
                                selectedRecipe={selectedRecipe}
                                upsertRecipe={upsertRecipe}
                                updateRecipeId={updateRecipeId}
                                // deleteRecipe={this.deleteRecipe}
                            />)}
                        />
                        {/* <SnackbarMessage
                            open={this.state.snackbarOpen}
                            severity={this.state.snackbarSeverity}
                            message={this.state.snackbarMessage}
                            undo={this.state.snackbarUndo}
                            closeSnackbar={this.closeSnackbar} /> */}
                    </Switch>         
                    <Footer />
                </Router>
            </React.StrictMode>
        )
    }
}

const mapStateToProps = state => {
    const {isLoaded, recipes, selectedRecipe} = state.recipesReducer;

    return {
        isLoaded,
        recipes,
        selectedRecipe
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRecipes: () => dispatch(fetchRecipes()),
    selectRecipe: recipeId => dispatch(selectRecipe(recipeId)),
    upsertRecipe: recipe => dispatch(upsertRecipe(recipe)),
    updateRecipeId: recipeId => dispatch(updateRecipeId(recipeId))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);