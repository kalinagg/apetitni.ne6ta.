import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Switch} from 'react-router-dom';
import Footer from './footer/Footer';
import RecipeList from './recipe-list/RecipeList';
import './index.scss';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Switch>
                <RecipeList />
            </Switch>              
            <Footer />
        </Router>
    </React.StrictMode>,
    document.querySelector('.root') as HTMLElement
);