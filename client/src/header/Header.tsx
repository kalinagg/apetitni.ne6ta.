import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {matchPath} from 'react-router-dom';
import clsx from 'clsx';
import Logo from '../logo/Logo';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import './Header.scss';

import {withRouter} from 'react-router';
const HeaderWithRouter = withRouter(props => <Header {...props}/>);
export default HeaderWithRouter;

interface IHeaderProps {}

class Header extends Component<IHeaderProps> {
    render() {
        const isOnRecipeList = matchPath((this.props as any).location.pathname, {path: `/recipe/:id`});
        
        return (
            <div className="header-container">     
                <Link to='/' className={clsx(!isOnRecipeList && "hidden")}>
                    <IconButton>
                        <KeyboardBackspaceIcon style={{color: '#666'}} />
                    </IconButton>
                </Link>
                <Logo />
                <Link to='/recipe/new'>
                    <Fab
                        className={clsx("add-icon", isOnRecipeList && "hidden")}
                        size="small"
                        color="secondary"
                        aria-label="Add Recipe"
                        style={{background: '#f33'}}>
                        <AddIcon />
                    </Fab>
                </Link>
            </div>
        )
    }
}