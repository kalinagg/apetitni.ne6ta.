export default interface IRecipe {
    id: number;
    ingredients: string;
    title: string;
    img: string;
    instructions: string;
    isUploading?: boolean;
    isEditMode?: boolean;
    error?: {message: string};
}