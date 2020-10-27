export default interface IRecipe {
    id: string;
    ingredients: string;
    title: string;
    img: string;
    instructions: string;
    isUploading?: boolean;
    isEditMode?: boolean;
}