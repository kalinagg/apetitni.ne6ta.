import React, {Component} from 'react';
import IRecipe from './IRecipe';
import IRecipeProps from './IRecipeProps';
import {Link} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import UndoIcon from '@material-ui/icons/Undo';
import imageCompression from 'browser-image-compression';
import './Recipe.scss';

class Recipe extends Component<IRecipeProps, IRecipe> {
    constructor(props: IRecipeProps) {
        super(props);        
        this.state = {
            ...props.recipe,
            isUploading: false,
            isEditMode: !this.isEdited()
        }    

        this.updateTitle = this.updateTitle.bind(this);
        this.updateIngredients = this.updateIngredients.bind(this);
        this.updateInstructions = this.updateInstructions.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
        this.edit = this.edit.bind(this);
        this.saveAndDoReadMode = this.saveAndDoReadMode.bind(this);
    }

    isEdited() {
        const {title, ingredients, instructions} = this.props.recipe;
        return title.length || ingredients.length || instructions.length;
    }

    updateTitle(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            title: event.target.value            
        });
    }

    updateIngredients(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            ingredients: event.target.value.split('\r\n')      
        });
    }

    updateInstructions(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {       
        this.setState({
            instructions: event.target.value           
        });
    }

    async uploadImage(event): Promise<void> {
        const formData = new FormData();
        const image = event.target.files[0];
        const options = {
            maxSizeMB: .2,
            maxWidthOrHeight: 450,
            useWebWorker: true,
            fileType: 'image/jpeg'
        };

        try {       
            this.setState({isUploading: true});

            const compressedImage = await imageCompression(image, options);
            formData.append('image', compressedImage);

            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const imagePathArr = await response.json();
            this.setState({
                img: imagePathArr[0],
                isUploading: false
            });
       } catch(error) {
            this.setState({error});
        }
    }

    edit(): void {
        this.doEditMode();
        this.recipeBeforeChange = this.state;
    }    

    recipeBeforeChange = {};

    cancelEdit(): void {
        this.doReadMode();
        this.setState(this.recipeBeforeChange);
    }

    doEditMode(): void {
        this.setState({
            isEditMode: true
        });
    }

    doReadMode(): void {
        this.setState({
            isEditMode: false
        })
    }

    saveAndDoReadMode(event: React.MouseEvent<HTMLButtonElement>, recipe: IRecipe): void {
        this.props.saveRecipes(event, recipe);
        this.doReadMode();
    }

    render() {
        const recipe = this.state;
        const classes = this.props.classes;

        return (
            <Card
                className={clsx(classes.card, "recipe", recipe.isEditMode && "edit-mode")}
                key={recipe.id}>
                <CardContent className={clsx(classes.cardContent)}>
                    <div className="recipe-container">
                        <div className="recipe-image-container">
                            <label
                                className="recipe-image-label"
                                htmlFor={"image-upload-" + recipe.id}
                                aria-label="Upload image">
                                <CircularProgress                        
                                    size="30px"
                                    className={
                                        clsx(
                                            classes.colorPrimary, 
                                            "recipe-progress-icon",
                                            recipe.isUploading && "visible")} />
                                <PhotoCameraIcon
                                    fontSize="inherit"
                                    className={
                                        clsx(
                                            "recipe-phoro-camera-icon",
                                            recipe.isEditMode && !recipe.isUploading && "visible")}/>
                                <img
                                    className={
                                        clsx(
                                            "recipe-image",
                                            recipe.isUploading && "transparent")}
                                    src={`/${recipe.img}`} alt={recipe.title} />
                            </label>
                            <input
                                disabled={!recipe.isEditMode}
                                type="file"
                                name="image"
                                id={"image-upload-" + recipe.id}
                                className="displayNone"
                                onChange={this.uploadImage} />
                        </div>
                        <div className="recipe-input-container">
                            <CardActions className={clsx(classes.cardActions)} disableSpacing>
                                <IconButton className="edit-icon" aria-label="Edit"
                                    onClick={this.edit}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton className="undo-icon" aria-label="Undo"
                                    onClick={this.cancelEdit}>
                                    <UndoIcon />
                                </IconButton>
                                <IconButton className="save-icon" aria-label="Save"
                                    onClick={e => this.saveAndDoReadMode(e, recipe)}>
                                    <SaveAltIcon />
                                </IconButton>
                                <IconButton className="share-icon" aria-label="Share">
                                    <ShareIcon />
                                </IconButton>
                                <Link to='/'>
                                    <IconButton className="delete-icon" aria-label="Delete"
                                        onClick={e => this.props.deleteRecipe(recipe.id, e)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Link>
                            </CardActions>
                            <div className="recipe-input recipe-input-first">
                                <TextField
                                    disabled={!recipe.isEditMode}
                                    margin="dense"
                                    fullWidth
                                    size="small"
                                    className="input-field title"
                                    id={'title-' + recipe.id}
                                    name={'title-' + recipe.id}
                                    label="Title"
                                    variant="outlined"
                                    value={recipe.title}
                                    onChange={this.updateTitle} />
                            </div>
                            <hr className="devider" />
                            <div className="recipe-input">
                                <TextField
                                    disabled={!recipe.isEditMode}
                                    margin="dense"
                                    multiline
                                    fullWidth
                                    className="input-field"
                                    id={'ingredients-' + recipe.id}
                                    name={'ingredients-' + recipe.id}
                                    label="Ingredients"
                                    variant="outlined"                                
                                    value={recipe.ingredients.join('\r\n')}
                                    onChange={this.updateIngredients} />     
                            </div>                            
                        </div>                        
                    </div>
                    <div className="recipe-input">
                        <TextField
                            disabled={!recipe.isEditMode}
                            margin="dense"
                            multiline
                            fullWidth
                            className="input-field instructions"
                            id={'instructions-' + recipe.id}
                            name={'instructions-' + recipe.id}
                            label="Instructions"
                            variant="outlined"
                            value={recipe.instructions}
                            onChange={this.updateInstructions} />
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
            paddingBottom: '8px',
        },
    },
    cardActions: {
        justifyContent: 'flex-end',
        padding: 0,
    },
    colorPrimary: {
        color: '#333',
    },
  }))(Recipe);