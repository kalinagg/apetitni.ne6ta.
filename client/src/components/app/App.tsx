import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import history from '../../helpers/history';
import HeaderWithRouter from '../header/Header';
import Footer from '../footer/Footer';
import SnackbarMessage from '../snackbar/SnackbarMessage';
import { closeSnackbar, deleteRecipeFromServer, fetchRecipes, selectRecipe, upsertRecipe } from '../../actions';
import { connect } from 'react-redux';
import ConnectedList from '../list/List';
import { RootState } from '../../types';
import ConnectedRecipe from '../recipe/Recipe';
import Progress from '../circular-progress/CircularProgress';

class App extends Component<any, {}> {
    componentDidMount() {
        this.props.fetchRecipes();
    }

    render() {
        const {
            recipesLoaded,
            selectedRecipe,
            selectRecipe,
            upsertRecipe,
            deleteRecipe,
            open, severity, message, undo, closeSnackbar} = this.props;        

        const listWithProgress = !recipesLoaded ? <Progress /> : <ConnectedList />;

        return (
            <React.StrictMode>
                <Router history={history}>
                    <HeaderWithRouter />
                    <Switch>
                        <Route exact path="/">
                            {listWithProgress}
                        </Route>  
                        <Route path="/recipe/:id" render={props => 
                            <ConnectedRecipe id={props.match.params.id} />}
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

const mapStateToProps = (state: RootState) => {
    const {recipesLoaded, selectedRecipe} = state.recipesState;
    const {open, severity, message, undo} = state.snackbarState;

    return {
        recipesLoaded,
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
    deleteRecipe: recipeId => dispatch(deleteRecipeFromServer(recipeId)),
    closeSnackbar: () => dispatch(closeSnackbar())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);