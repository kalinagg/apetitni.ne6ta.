import React, {Component} from 'react';
import Logo from '../logo/Logo';
import './Footer.scss';


export default class Footer extends Component<any, any> {
    render() {
        return (
            <footer className="footer">
                <Logo />
                <p className="footer-text">Уеб сайт за нови и стари рецепти.</p>        
            </footer>
        )
    }
}