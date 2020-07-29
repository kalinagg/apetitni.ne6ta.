import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import IRecipe from '../recipe/IRecipe';
import './RecipeThumbnail.scss';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';

interface IRecipeThumbnailProps {
    recipe: IRecipe;
    classes: any;
}

class RecipeThumbnail extends Component<IRecipeThumbnailProps, {}> {
    render() {
        const {recipe, classes} = this.props;

        return (
            <Link to={`/recipe/${recipe.id}`}>
                <Card
                    className={clsx(classes.card, "recipe-thumbnail")}>                        
                    <CardContent className={clsx(classes.cardContent)}>
                        <div className="recipe-image-container">
                            <img className="recipe-image" src={recipe.img} alt={recipe.title} />      
                        </div>
                        <h2>{recipe.title}</h2>
                    </CardContent>
                </Card>
            </Link>
        );
    }
}

export default withStyles(theme => ({
    card: {
        boxShadow: '3px 5px 4px #bbb',
        borderRadius: 0,
        border: '1px solid #eee',
    },
    cardContent: {
        '&:last-child': {
            paddingBottom: '16px',
        }
    },
  }))(RecipeThumbnail);