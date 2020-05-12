import React, { Component } from 'react';
import Footer from './footer/Footer';
import RecipeList from './recipe/RecipeList';

export default class App extends Component<any, any> {
    render() {
        return (
            <React.Fragment>                
                <RecipeList />
                <Footer />
            </React.Fragment>
        )
    }
}