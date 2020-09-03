import React from 'react';
import HeaderComponent from '../components/Header';
import { FooterComponent } from '../components/Footer';
import { Route } from 'react-router-dom';

export const HomeComponent = (props) => {
    return <>
        <HeaderComponent/>
        { props.children }
        <FooterComponent/>
    </>
};

export const HomeTemplates = ({Component, ...rest}) => {
    return (
        <Route {...rest} render={(props) => {
            return <HomeComponent>
                <Component {...props}/>
            </HomeComponent>
        }}/>
    )
}
