const {MongoClient} = require('mongodb');
const uuidv4 = require('uuid/v4');
require('dotenv').config();

class RecipeManager {
    constructor() {
        this.MONGODB_URL = 'mongodb+srv://' + process.env.MONGODB_URL + '/recipes';
    }

    async getRecipes() {
        const client = new MongoClient(this.MONGODB_URL);
    
        try {
            await client.connect();
            const recipes = await (await client.db('recipes').collection('recipes').find().toArray());
            recipes.forEach(r => delete r._id);          
            return recipes;
        } finally {
            await client.close();
        }
    }

    async addRecipe(recipe) {
        const client = new MongoClient(this.MONGODB_URL);
    
        try {
            await client.connect();
            const collection = client.db('recipes').collection('recipes');
            recipe.id = uuidv4();
            const result = await collection.insertOne(recipe);
    
            if (!result.insertedCount) {
                throw new Error('The recipe could not be saved.');
            }
    
            return recipe.id;
        } finally {
            await client.close();
        }
    }

    async updateRecipe(recipe) {
        const client = new MongoClient(this.MONGODB_URL);
    
        try {
            await client.connect();
            const collection = client.db('recipes').collection('recipes');
            delete recipe._id; // mongodb does not like to update _id
            const result = await collection.replaceOne({id: recipe.id}, recipe);
    
            if (!result.matchedCount) {
                throw new Error('The recipe could not be updated.');
            }
            
            return recipe.id;
        } finally {
            await client.close();
        } 
    }

    async deleteRecipe(recipeId) {
        const client = new MongoClient(this.MONGODB_URL);
    
        try {
            await client.connect();
            const collection = client.db('recipes').collection('recipes');
            const result = await collection.deleteOne({id: recipeId});
    
            if (!result.deletedCount) {
                throw new Error('The recipe could not be deleted.');
            }    
        } finally {
            await client.close();
        } 
    }
}

module.exports = RecipeManager;