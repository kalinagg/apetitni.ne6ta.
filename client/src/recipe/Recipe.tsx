import React, { Component } from 'react';
import './Recipe.scss';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import UndoIcon from '@material-ui/icons/Undo';

export interface IRecipe {
    error?: { message: string };
    id: number;
    ingredients: string[];
    title: string;
    img: string;
    instructions: string;
}

export interface IRecipeProps {
    recipe: IRecipe;
    classes: any;
    handleSubmit(event: React.FormEvent<HTMLElement>, recipe: IRecipe): void;
    handleDelete(recipeId: number, event: any): void;
}

class Recipe extends Component<IRecipeProps, IRecipe> {
    constructor(props: IRecipeProps) {
        super(props);
        this.state = props.recipe;

        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeInstructions = this.handleChangeInstructions.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleChangeTitle(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            title: event.target.value            
        });
    }

    handleChangeIngredients(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            ingredients: event.target.value.split('\r\n')        
        });
    }

    handleChangeInstructions(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {        
        this.setState({
            instructions: event.target.value           
        });
    }

    async uploadImage(event): Promise<void> {
        const formData = new FormData();
        
        formData.append('image', event.target.files[0]);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
    
            const imagePathArr = await response.json();
    
            this.setState({
                img: imagePathArr[0]            
            });
        } catch(error) {
            this.setState({ error });
        }
    }

    handleEdit(event: any) {
        this.toggleEditMode(event);
        this.recipeBeforeChange = this.state;
    }

    recipeBeforeChange: any = {};

    handleUndo(event:any) {
        this.toggleEditMode(event);
        this.setState(this.recipeBeforeChange);
    }

    toggleEditMode(event: any): void {
        const currentRecipe = event.currentTarget.closest('.recipe');        

        currentRecipe.classList.toggle('activate-edit-mode');
        currentRecipe.querySelectorAll('input, textarea')
            .forEach(input => input.toggleAttribute('disabled'));
    }

    render() {
        const recipe = this.state;
        const classes = this.props.classes;

        return (
            <Card className={clsx(classes.card, "recipe")} key={recipe.id}>                    
                <CardContent className={clsx(classes.cardContent)}>
                    <div className="recipe-container">
                        <div className="recipe-image-container">
                            <label htmlFor={"image-upload-" + recipe.id}>
                                <img className="recipe-image" src={recipe.img} alt={recipe.title} />
                            </label>
                            <input
                                disabled
                                type="file"
                                name="image"
                                id={"image-upload-" + recipe.id}
                                className="hidden"
                                onChange={e => this.uploadImage(e)} />
                        </div>
                        <div className="recipe-input-container">
                            <CardActions className={clsx(classes.cardActions)} disableSpacing>
                                <IconButton className="edit-icon" aria-label="Edit"
                                    onClick={ e => this.handleEdit(e) }>
                                    <EditIcon />
                                </IconButton>
                                <IconButton className="undo-icon" aria-label="Undo"
                                    onClick={ e => this.handleUndo(e) }>
                                    <UndoIcon />
                                </IconButton>
                                <IconButton className="save-icon" aria-label="Save"
                                    onClick={e => this.props.handleSubmit(e, recipe)}>
                                    <SaveAltIcon />
                                </IconButton>
                                <IconButton className="share-icon" aria-label="Share">
                                    <ShareIcon />
                                </IconButton>
                                <IconButton className="delete-icon" aria-label="Delete"
                                    onClick={e => this.props.handleDelete(recipe.id, e)}>
                                    <DeleteIcon />
                                </IconButton>                        
                            </CardActions>
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
                                    onChange={e => this.handleChangeTitle(e)} />
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
                                    onChange={e => this.handleChangeIngredients(e)} />     
                            </div>
                        </div>
                    </div>                        
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
                            onChange={e => this.handleChangeInstructions(e)} />
                    </div>                   
                </CardContent>                                        
            </Card>
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
        '&:last-child': {
            paddingBottom: '16px',
        },
    },
    cardActions: {
        justifyContent: 'right',
        padding: 0,
    },    
  }))(Recipe);