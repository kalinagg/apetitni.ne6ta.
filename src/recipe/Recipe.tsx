import React, { Component, Fragment } from 'react';
import './Recipe.scss';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import UndoIcon from '@material-ui/icons/Undo';

export interface IRecipeContainerState {
    state: IRecipeContainer;
    handleSubmit(event: React.FormEvent<HTMLElement>): void;
    handleChangeTitle(recipeId: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    handleChangeIngredients(recipeId: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    handleChangeInstructions(recipeId: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    handleExpandClick(recipeId: number): void;
    handleDelete(recipeId: number, event: any): void;
    handleEdit(event): void;
    handleUndo(event): void;
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
}

export class AddRecipeButton extends Component<any, any> {    
    render() {
        return (
            <Fragment>
                <Fab
                    size="small"
                    color="secondary"
                    aria-label="Add Recipe"
                    style={{background: '#f33'}}
                    onClick={() => this.props.handleAddRecipe()}>
                    <AddIcon />
                </Fab>
            </Fragment>
        );
    }
}

class Recipe extends Component<IRecipeContainerState, any> {
    render() {
        const { error, isLoaded, recipes, expanded, expandedId } = this.props.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        }

        if (!isLoaded) {
            return <div>Loading ...</div>
        }

        const classes = this.props.classes;
        return (
            recipes.map(recipe => (
                <Card className={clsx(classes.card, "recipe")} key={recipe.id}>
                    <CardContent className={clsx(classes.cardContent)}>
                        <div className="recipe-image-container">
                            <label htmlFor="image-upload">
                                <img className="recipe-image" src={recipe.img} alt={recipe.title} />
                            </label>
                            <input type="file" id="image-upload" className="hidden" />
                        </div>
                        <div className="recipe-input-container">
                            <div className="recipe-input">
                                <TextField
                                    disabled
                                    margin="dense"
                                    fullWidth
                                    size="small"
                                    className="input-field title"
                                    id={'title-' + recipe.id}
                                    name={'title-' + recipe.id}
                                    label="Title"
                                    variant="outlined"
                                    value={recipe.title}
                                    onChange={e => this.props.handleChangeTitle(recipe.id, e)} />  
                            </div>
                            <hr className="devider" />
                            <div className="recipe-input">
                                <TextField
                                    disabled
                                    margin="dense"
                                    multiline
                                    fullWidth
                                    className="input-field"
                                    id={'ingredients-' + recipe.id}
                                    name={'ingredients-' + recipe.id}
                                    label="Ingredients"
                                    variant="outlined"                                
                                    value={recipe.ingredients.join('\r\n')}
                                    onChange={e => this.props.handleChangeIngredients(recipe.id, e)} />     
                            </div>                    
                        </div>
                    </CardContent>
                    <CardActions className={clsx(classes.cardActions)} disableSpacing>
                        <IconButton className="edit-icon" aria-label="Edit"
                            onClick={ e => this.props.handleEdit(e) }>
                            <EditIcon />
                        </IconButton>
                        <IconButton className="undo-icon" aria-label="Undo"
                            onClick={ e => this.props.handleUndo(e) }>
                            <UndoIcon />
                        </IconButton>
                        <IconButton className="save-icon" aria-label="Save"
                            onClick={e => this.props.handleSubmit(e)}>
                            <SaveAltIcon />
                        </IconButton>
                        <IconButton className="share-icon" aria-label="Share">
                            <ShareIcon />
                        </IconButton>
                        <IconButton className="delete-icon" aria-label="Delete"
                            onClick={e => this.props.handleDelete(recipe.id, e)}>
                            <DeleteIcon />
                        </IconButton>                    
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
                            <div className="recipe-input">
                                <TextField
                                    disabled
                                    margin="dense"
                                    multiline
                                    fullWidth
                                    className="input-field instructions"
                                    id={'instructions-' + recipe.id}
                                    name={'instructions-' + recipe.id}
                                    label="Instructions"
                                    variant="outlined"
                                    value={recipe.instructions}
                                    onChange={e => this.props.handleChangeInstructions(recipe.id, e)} />
                            </div>                        
                        </CardContent>
                    </Collapse>
                </Card>
            ))
        );
    }
}

export default withStyles(theme => ({
    card: {
        boxShadow: '3px 5px 4px #bbb',
        borderRadius: 0,
        border: '1px solid #eee'
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    cardActions: {
        justifyContent: 'space-between',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    }
  }))(Recipe);