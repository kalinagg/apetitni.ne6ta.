import React from 'react';
import {Link} from 'react-router-dom';
import IRecipe from '../recipe/IRecipe';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import './Thumbnail.scss';

interface IThumbnailProps {
    recipe: IRecipe;
    classes: any;
}

const Thumbnail = (props: IThumbnailProps) => {
    const {recipe, classes} = props;

    return (
        <Link to={`/recipe/${recipe.id}`}>
            <Card className={clsx(classes.card, "thumbnail")}>                        
                <CardContent className={clsx(classes.cardContent)}>
                    <img className="thumbnail-image" src={recipe.img} alt={recipe.title} />     
                    <h2>{recipe.title}</h2>
                </CardContent>
            </Card>
        </Link>
    );
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
  }))(Thumbnail);