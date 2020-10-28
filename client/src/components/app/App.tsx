import React, {Component} from 'react';
import {Router, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import history from '../../helpers/history';
import {fetchRecipes} from '../../actions';
import HeaderWithRouter from '../header/Header';
import Footer from '../footer/Footer';
import ConnectedSnackbar from '../snackbar/SnackbarMessage';
import ConnectedList from '../list/List';
import { RootState } from '../../types';
import ConnectedRecipe from '../recipe/Recipe';
import Progress from '../circular-progress/CircularProgress';

class App extends Component<any, {}> {
    componentDidMount() {
        this.props.fetchRecipes();
    }

    render() {
        const {recipesLoaded} = this.props;
        const listWithProgress = !recipesLoaded ? <Progress /> : <ConnectedList />;

        return (
            <React.StrictMode>
                <Router history={history}>
                    <HeaderWithRouter />
                    <Switch>
                        <Route exact path="/">
                            {listWithProgress}
                        </Route>  
                        <Route
                            path="/recipe/:id" 
                            render={props => <ConnectedRecipe id={props.match.params.id} />} />
                    </Switch>         
                    <ConnectedSnackbar />
                    <Footer />
                </Router>
            </React.StrictMode>
        )
    }
}

const mapStateToProps = (state: RootState) => ({
    recipesLoaded: state.recipesState.recipesLoaded      
});

const mapDispatchToProps = dispatch => ({
    fetchRecipes: () => dispatch(fetchRecipes())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);