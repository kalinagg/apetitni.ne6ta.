import React, {Component} from 'react';
import IRecipe from './IRecipe';
import IRecipeProps from './IRecipeProps';
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
import compressImage from 'browser-image-compression';
import newRecipeImageUrl from '../new-recipe.jpg';
import './Recipe.scss';

interface IRecipeState {
    recipe: IRecipe;
    recipeBeforeChange: IRecipe;
    isUploading: boolean;
    isEditMode: boolean;
}

class Recipe extends Component<IRecipeProps, IRecipeState> {
    constructor(props: IRecipeProps) {
        super(props);
        const recipeId = (props as any).match.params.id;
        const isRecipeNew = recipeId === 'new';
        const recipe = isRecipeNew
            ? {
                id: '',
                title: '',
                instructions: '',
                img: newRecipeImageUrl,
                ingredients: ''}
            : props.getRecipeById(recipeId);

        this.state = {
            recipe,
            recipeBeforeChange: recipe,
            isUploading: false,
            isEditMode: isRecipeNew
        }        

        this.updateTitle = this.updateTitle.bind(this);
        this.updateIngredients = this.updateIngredients.bind(this);
        this.updateInstructions = this.updateInstructions.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);        
    }

    updateTitle(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                title: event.target.value
            }
        });     
    }

    updateIngredients(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                ingredients: event.target.value
            }
        });
    }

    updateInstructions(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                instructions: event.target.value
            }
        });      
    }

    async handleUploadImage(event): Promise<void> {    
        this.setState({isUploading: true});
            
        const image = event.target.files[0];
        this.setState({
            ...this.state,
            isUploading: false,
            recipe: {
                ...this.state.recipe,
                img: await this.compressImage(image)
            }
        });       
    }

    async compressImage(file: File | Blob ): Promise<string> {
        const options = {
            maxSizeMB: .2,
            maxWidthOrHeight: 450,
            useWebWorker: true,
            fileType: 'image/jpeg'
        };

        const compressedImage = await compressImage(file, options);
        const base64Image = await this.convertToBase64(compressedImage);

        return base64Image;
    }

    convertToBase64(file: File | Blob): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string); 
            reader.onerror = err => reject(err);
        });
    }

    handleEdit(): void {
        this.setState({
            isEditMode: true
        });
    }

    handleCancel(): void {        
        this.setState({
            isEditMode: false,
            recipe: this.state.recipeBeforeChange
        });
    }

    handleSave(recipe: IRecipe): void {
        this.props.saveRecipe(recipe);        
        this.setState({
            isEditMode: false
        })
    }

    render() {
        const {recipe, isEditMode, isUploading} = this.state;
        const classes = this.props.classes;

        return (
            <Card
                className={clsx(classes.card, "recipe", isEditMode && "edit-mode")}
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
                                            isUploading && "visible")} />
                                <PhotoCameraIcon
                                    fontSize="inherit"
                                    className={
                                        clsx(
                                            "recipe-phoro-camera-icon",
                                            isEditMode && !isUploading && "visible")}/>
                                <img
                                    className={clsx("recipe-image", isUploading && "transparent")}
                                    src={recipe.img}
                                    alt={recipe.title} />
                            </label>
                            <input
                                disabled={!isEditMode}
                                type="file"
                                name="image"
                                id={"image-upload-" + recipe.id}
                                className="displayNone"
                                onChange={this.handleUploadImage} />
                        </div>
                        <div className="recipe-input-container">
                            <CardActions className={clsx(classes.cardActions)} disableSpacing>
                                <IconButton className="edit-icon" aria-label="Edit"
                                    onClick={this.handleEdit}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton className="undo-icon" aria-label="Undo"
                                    onClick={this.handleCancel}>
                                    <UndoIcon />
                                </IconButton>
                                <IconButton className="save-icon" aria-label="Save"
                                    onClick={async () => await this.handleSave(recipe)}>
                                    <SaveAltIcon />
                                </IconButton>
                                <IconButton className="share-icon" aria-label="Share">
                                    <ShareIcon />
                                </IconButton>                                
                                <IconButton
                                    className="delete-icon" aria-label="Delete"                                    
                                    onClick={async () => await this.props.deleteRecipe(recipe.id)}> 
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                            <div className="recipe-input recipe-input-first">
                                <TextField
                                    disabled={!isEditMode}
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
                                    disabled={!isEditMode}
                                    margin="dense"
                                    multiline
                                    fullWidth
                                    className="input-field"
                                    id={'ingredients-' + recipe.id}
                                    name={'ingredients-' + recipe.id}
                                    label="Ingredients"
                                    variant="outlined"                                
                                    value={recipe.ingredients}
                                    onChange={this.updateIngredients} />     
                            </div>                            
                        </div>                        
                    </div>
                    <div className="recipe-input">
                        <TextField
                            disabled={!isEditMode}
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