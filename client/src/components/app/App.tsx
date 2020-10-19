import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import history from '../../helpers/history';
import HeaderWithRouter from '../header/Header';
import Footer from '../footer/Footer';
import SnackbarMessage from '../snackbar/SnackbarMessage';
import { closeSnackbar, deleteRecipeFromServer, fetchRecipes, selectRecipe, updateRecipeId, upsertRecipe } from '../../actions';
import { connect } from 'react-redux';
import Recipe from '../recipe/Recipe';
import List from '../list/List';

class App extends Component<any, {}> {
    componentDidMount() {
        this.props.fetchRecipes();        
    }

    render() {
        const {
            error,
            isLoaded,
            recipes,
            selectedRecipe,
            selectRecipe,
            upsertRecipe,
            updateRecipeId,
            deleteRecipe,
            open, severity, message, undo, closeSnackbar} = this.props;        
        
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
                                deleteRecipe={deleteRecipe}
                            />)}
                        />
                    </Switch>         
                    <SnackbarMessage
                        open={open}
                        severity={severity}
                        message={message}
                        undo={undo}
                        closeSnackbar={closeSnackbar} />
                    <Footer />
                </Router>
            </React.StrictMode>
        )
    }
}

const mapStateToProps = state => {
    const {isLoaded, recipes, selectedRecipe} = state.recipesReducer;
    const {open, severity, message, undo} = state.snackbarReducer;

    return {
        isLoaded,
        recipes,
        selectedRecipe,
        open,
        severity,
        message,
        undo
    }
}

const mapDispatchToProps = dispatch => ({
    fetchRecipes: () => dispatch(fetchRecipes()),
    selectRecipe: recipeId => dispatch(selectRecipe(recipeId)),
    upsertRecipe: recipe => dispatch(upsertRecipe(recipe)),
    updateRecipeId: recipeId => dispatch(updateRecipeId(recipeId)),
    deleteRecipe: recipeId => dispatch(deleteRecipeFromServer(recipeId)),
    closeSnackbar: () => dispatch(closeSnackbar())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);