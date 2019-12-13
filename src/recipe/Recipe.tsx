import React, {Component} from 'react';
import './Recipe.scss';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import '@material-ui/core/Button';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export interface IRecipeContainerState {
    state: IRecipeContainer;
    handleSubmit(event:React.FormEvent<HTMLElement>):void;
    handleChangeTitle(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void;
    handleChangeIngredients(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void;
    handleChangeInstructions(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void;
    handleExpandClick(recipeId: number):void;
    handleDelete(recipeId: number, event:React.FormEvent<HTMLElement>):void;
    classes: any;
}

export interface IRecipeContainer {
    error?: { message: string };
    isLoaded: boolean;
    recipes: IRecipe[];
    expanded: boolean;
    expandedId: number;
}

export interface IRecipe {
    id: number;
    ingredients: string[];
    title: string;
    img: string;
    instructions: string;
    propTypes: any;
}

class Recipe extends Component<IRecipeContainerState, any> {
    render() {
        const {error, isLoaded, recipes, expanded, expandedId} = this.props.state;
        if(error) {
            return <div>Error: {error.message}</div>;
        }

        if(!isLoaded) {
            return <div>Loading ...</div>
        }

        const classes = this.props.classes;
        return (
            recipes.map(recipe => (
                <Card className={classes.card} key={recipe.id}>                
                    <CardMedia 
                        className={classes.media}
                        image={recipe.img} />
                    <CardContent> 
                        <TextField
                            id={'title-' + recipe.id}
                            name={'title-' + recipe.id}
                            label="Title"
                            variant="outlined"
                            value={recipe.title}
                            onChange={e => this.props.handleChangeTitle(recipe.id, e)} />
                        <br/><br/>    
                        <TextField
                            multiline
                            id={'ingredients-' + recipe.id}
                            name={'ingredients-' + recipe.id}
                            label="Ingredients"
                            variant="outlined"
                            value={recipe.ingredients.join('\r\n')}
                            onChange={e => this.props.handleChangeIngredients(recipe.id, e)} /> 
                        <br/><br/>                                            
                        <Button
                            type="button"
                            onClick={e => this.props.handleDelete(recipe.id, e)}
                            variant="contained"
                            color="secondary">Delete</Button>
                        &nbsp;&nbsp;     
                        <Button
                            type="button"
                            onClick={this.props.handleSubmit}
                            variant="contained"
                            color="primary">Save</Button>     
                    </CardContent>
                    <CardActions disableSpacing>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expandedId === recipe.id && expanded,
                            })}
                            onClick={() => this.props.handleExpandClick(recipe.id)}
                            aria-expanded={expandedId === recipe.id && expanded}
                            aria-label="Show more">
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={expandedId === recipe.id && expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <TextField
                                    multiline
                                    id={'instructions-' + recipe.id}
                                    name={'instructions-' + recipe.id}
                                    label="Instructions"
                                    variant="outlined"
                                    value={recipe.instructions}
                                    onChange={e => this.props.handleChangeInstructions(recipe.id, e)} />
                        </CardContent>
                    </Collapse>
                </Card>
            ))
        );
    }
}
  
export default withStyles(theme => ({
    card: {
      maxWidth: 345,
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    }
  }))(Recipe);
  