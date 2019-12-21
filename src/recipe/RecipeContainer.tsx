import React, { Component } from 'react';
import Recipe, { IRecipeContainer, IRecipe, AddRecipeButton } from './Recipe';

interface IRecipeContainerProps {}

export default class RecipeContainer extends Component<any, IRecipeContainer> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false,
            recipes: [],
            expanded: false,
            expandedId: -1
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeIngredients = this.handleChangeIngredients.bind(this);
        this.handleChangeInstructions = this.handleChangeInstructions.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddRecipe = this.handleAddRecipe.bind(this);
    }

    componentDidMount() {
        this.getRecipes();
    }

    getRecipes():void {
        fetch('./recipes')
            .then(recipes => recipes.json())
            .then(
                recipes => {
                    this.setState({
                        isLoaded: true,
                        recipes
                    });
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    updateRecipeById(recipeId:number, recipes:IRecipe[], changeRecipe:(recipe: IRecipe) => void):IRecipe[] {
        const recipesToUpdate = recipes.filter((r, i) => r.id === recipeId);

        if(!recipesToUpdate.length) {
            throw new Error("Recipe not found:" + recipeId);
        }

        changeRecipe(recipesToUpdate[0]);

        return recipes;
    }

    deleteRecipeById(recipeId:number, recipes:IRecipe[]) {
        return recipes.filter(r => r.id !== recipeId);
    }

    handleChangeTitle(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void {
        this.setState({
            recipes: this.updateRecipeById(
                recipeId,
                this.state.recipes,
                r => r.title = event.target.value)
        });
    }

    handleChangeIngredients(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void {
        const ingredients = event.target.value.split('\r\n');

        this.setState({
            recipes: this.updateRecipeById(
                recipeId,
                this.state.recipes,
                r => r.ingredients = ingredients)
        });
    }

    handleChangeInstructions(recipeId: number, event:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void {
        this.setState({
            recipes: this.updateRecipeById(
                recipeId,
                this.state.recipes,
                r => r.instructions = event.target.value)
        });
    }

    saveRecipes(recipes:IRecipe[]): Promise<void> {
        return fetch('./recipes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipes)
        }).then(r => { console.log(r.statusText)});
    }

    handleSubmit(event:React.FormEvent<HTMLElement>):void {
        this.saveRecipes(this.state.recipes);
    }

    handleDelete(recipeId:number, event:React.FormEvent<HTMLElement>):void {
        const newRecipes = this.deleteRecipeById(
            recipeId,
            this.state.recipes
        );

        this.saveRecipes(newRecipes).then(() => {
            this.setState({
                recipes: newRecipes
            });
        });
    }

    handleExpandClick(recipeId:number):void {
        this.setState({
            // expanded: !(this.state.expandedId === recipeId && this.state.expanded),
            // expanded: this.state.expandedId !== recipeId || !this.state.expanded,
            expanded: this.state.expandedId === recipeId ? !this.state.expanded : true,
            expandedId: recipeId
        }); 
    };

    handleAddRecipe():void {
        const recipes = this.state.recipes;
        const recipesIds: number[] = [];

        recipes.forEach(r => {
            recipesIds.push(r.id);
        });

        const newRecipe = {
            id: recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
            title: '',
            instructions: '',
            img: 'img_food/default.jpg',
            ingredients: []
        }

        this.setState({
            recipes: [
                newRecipe,
                ...this.state.recipes]
        });
    }

    render() {
        return (
            <React.Fragment>
                <AddRecipeButton handleAddRecipe={this.handleAddRecipe} />
                <div className="recipe-container">
                    <Recipe state={this.state}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeIngredients={this.handleChangeIngredients}
                    handleChangeInstructions={this.handleChangeInstructions}
                    handleSubmit={this.handleSubmit}
                    handleExpandClick={this.handleExpandClick}
                    handleDelete={this.handleDelete} />
                </div>
            </React.Fragment>    
        )
    }
}