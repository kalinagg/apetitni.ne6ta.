import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Logo from '../logo/Logo';
import './Header.scss';
import clsx from 'clsx';

interface IHeaderProps {
    handleAddRecipe(): void;
}

export default class Header extends Component<IHeaderProps> {
    render() {
        return (
            <div className="header-container">
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
