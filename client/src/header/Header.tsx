import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import clsx from 'clsx';
import Logo from '../logo/Logo';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import './Header.scss';
import IRecipe from '../recipe/IRecipe';

interface IHeaderProps {
    matchId: any;
    recipe: IRecipe;
    addRecipe(): void;
}

export default class Header extends Component<IHeaderProps> {
    render() {
        const {matchId} = this.props;

        return (
            <div className="header-container">        
                <Link to='/' className={clsx(!matchId && "hidden")}>
                    <IconButton>
                        <KeyboardBackspaceIcon style={{color: '#666'}} />
                    </IconButton>
                </Link>
                <Logo />
                    <Fab
                        className={clsx("add-icon")}
                        size="small"
                        color="secondary"
                        aria-label="Add Recipe"
                        style={{background: '#f33'}}
                        onClick={() => this.props.addRecipe()}>
                        <AddIcon />
                    </Fab>
            </div>
        )
    }
}
