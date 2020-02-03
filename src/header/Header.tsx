import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Logo from '../logo/Logo';
import './Header.scss';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';

interface IHeaderProps {
    listView: boolean;
    showRecipeList(): void;
    handleAddRecipe(): void;
}

export default class Header extends Component<IHeaderProps> {
    render() {
        return (
            <div className="header-container">
                <IconButton
                    className={clsx(this.props.listView && "back-arrow-hidden")}
                    onClick={this.props.showRecipeList}>
                    <KeyboardBackspaceIcon style={{color: '#666'}} />
                </IconButton>                
                <Logo />
                <Fab
                    className={clsx("add-icon")}
                    size="small"
                    color="secondary"
                    aria-label="Add Recipe"
                    style={{background: '#f33'}}
                    onClick={() => this.props.handleAddRecipe()}>
                    <AddIcon />
                </Fab>
            </div>
        )
    }
}
