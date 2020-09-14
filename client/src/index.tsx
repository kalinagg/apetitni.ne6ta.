import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Switch} from 'react-router-dom';
import history from './history';
import Footer from './footer/Footer';
import RecipeList from './recipe-list/RecipeList';
import HeaderWithRouter from './header/Header';
import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <Router history={history}>
            <HeaderWithRouter />
            <Switch>
                <RecipeList />
            </Switch>              
            <Footer />
        </Router>
    </React.StrictMode>,
    document.querySelector('.root') as HTMLElement
);