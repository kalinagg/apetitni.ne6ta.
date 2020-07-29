import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch} from 'react-router-dom';
import history from './history';
import Footer from './footer/Footer';
import RecipeList from './recipe-list/RecipeList';
import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <Switch>
                <RecipeList />
            </Switch>              
            <Footer />
        </Router>
    </React.StrictMode>,
    document.querySelector('.root') as HTMLElement
);