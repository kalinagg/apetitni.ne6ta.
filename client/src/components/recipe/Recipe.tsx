import React, {Component} from 'react';
import IRecipe from './IRecipe';
import { connect } from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import UndoIcon from '@material-ui/icons/Undo';
import compressImage from 'browser-image-compression';
import history from '../../helpers/history';
import newRecipeImageUrl from '../../new-recipe.jpg';
import './Recipe.scss';
import { RootState } from '../../types';
import { deleteRecipeFromServer, selectRecipe, upsertRecipe } from '../../actions';
import Progress from '../circular-progress/CircularProgress';
import { CircularProgress } from '@material-ui/core';

interface IRecipeProps {
    classes: any;
    recipe: IRecipe | undefined;
    id: string;
    recipesLoaded: boolean;
    selectRecipe(id: string): IRecipe;
    upsertRecipe(recipe: IRecipe): Promise<string>;
    deleteRecipe(recipeId: string): Promise<void>;
}

interface IRecipeState {
    recipe: IRecipe | undefined;
    recipeBeforeChange: IRecipe | undefined;
    isUploading: boolean;
    isEditMode: boolean;
}

class Recipe extends Component<IRecipeProps, IRecipeState> {
    constructor(props: IRecipeProps) {
        super(props);
        const isRecipeNew = props.id === 'new';
        const recipe = isRecipeNew
            ? {
                id: '',
                title: '',
                instructions: '',
                img: newRecipeImageUrl,
                ingredients: ''}
            : props.recipe;

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
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentDidMount() {
        this.selectRecipe();
    }

    componentDidUpdate() {
        this.selectRecipe();

        if (!this.state.recipe || (this.props.recipe && this.state.recipe.id !== this.props.recipe.id)) {       
            this.setState({
                ...this.state,
                recipe: this.props.recipe,
                recipeBeforeChange: this.props.recipe                        
            });
        }
    }

    private selectRecipe() {
        if (this.props.recipesLoaded) {
            this.props.selectRecipe(this.props.id);
        }
    }

    updateTitle(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!this.state.recipe) return;

        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                title: event.target.value
            }
        });     
    }

    updateIngredients(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!this.state.recipe) return;

        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                ingredients: event.target.value
            }
        });
    }

    updateInstructions(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        if (!this.state.recipe) return;

        this.setState({
            ...this.state,
            recipe: {
                ...this.state.recipe,
                instructions: event.target.value
            }
        });      
    }

    async handleUploadImage(event): Promise<void> {
        if (!this.state.recipe) return;

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
            maxSizeMB: .05,
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

    async handleDelete(recipeId: string): Promise<void> {
        await this.props.deleteRecipe(recipeId);
        history.push('/');
    }

    async handleSave(recipe: IRecipe): Promise<void> {
        const recipeId = await this.props.upsertRecipe(recipe);
        history.push(`/recipe/${recipeId}`);

        this.setState({
            isEditMode: false,
            recipeBeforeChange: recipe
        });
    }

    render() {
        const {recipe, isEditMode, isUploading} = this.state;
        const classes = this.props.classes;

        if (!recipe) return <Progress />
        
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
                                    onClick={async () => await this.handleDelete(recipe.id)}>
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

const recipeWithStyles = withStyles(theme => ({
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

const mapStateToProps = (state: RootState) => {
    const {recipesLoaded, selectedRecipe} = state.recipesState;

    return {
        recipesLoaded,
        recipe: selectedRecipe,        
    }
}  

const mapDispatchToProps = dispatch => ({
    selectRecipe: recipeId => dispatch(selectRecipe(recipeId)),
    upsertRecipe: recipe => dispatch(upsertRecipe(recipe)),
    deleteRecipe: recipeId => dispatch(deleteRecipeFromServer(recipeId)),
});

const ConnectedRecipe = connect(mapStateToProps, mapDispatchToProps)(recipeWithStyles);

export default ConnectedRecipe;