import React, {Component} from 'react';
import {Switch} from 'react-router-dom';
import Footer from './footer/Footer';
import RecipeList from './recipe/RecipeList';

export default class App extends Component<any, any> {
    render() {
        return (
            <React.Fragment>
                <Switch>
                    <RecipeList />
                </Switch>              
                <Footer />
            </React.Fragment>
        )
    }
}