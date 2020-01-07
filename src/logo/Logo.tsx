import React, { Component } from 'react';
import logo from './logo.svg';


export default class Logo extends Component<any, any> {
    render() {
        return (
            <img src={logo} className="logo" alt="Apetitni Ne6ta" />
        )
    }
}