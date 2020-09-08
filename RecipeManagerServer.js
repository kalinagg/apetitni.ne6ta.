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
            return await client.db('recipes').collection('recipes').find().toArray();
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
            const filter = {id: recipe.id};
            const result = await collection.updateOne(filter, {$set: recipe});
    
            if (!result.modifiedCount) {
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