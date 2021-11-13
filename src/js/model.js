import { API_URL, RES_PER_PAGE, KEY } from './confing.js';
import { AJAX } from './helpers.js';


export const state = {
   recipe: {},
   search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE
   },
   bookmarks: []
}

const createRecipeObject = function(recipe){
   
   state.recipe = {
      id:recipe.id,
      title:recipe.title,
      publisher:recipe.publisher,
      source_url:recipe.source_url,
      image_url:recipe.image_url,
      servings:recipe.servings,
      cooking_time:recipe.cooking_time,
      ingredients:recipe.ingredients,
      ...(recipe.key && { key: recipe.key })
   }
}

export const loadRecipe = async function(id){
   try{
      const { recipe } = await AJAX(`${API_URL}${id}?key=${KEY}`)

      createRecipeObject(recipe)
      
      state.bookmarks.some(bookmark => bookmark.id == id) ? state.recipe.bookmarked = true : state.recipe.bookmarked = false;

   }catch(err){
      throw err;
   }
};

export const loadSearchResults = async function(query){
   try {
      state.search.query = query;
      const { recipes } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`)
      state.search.results = recipes.map(recipe => {
         return {
            id:recipe.id,
            title:recipe.title,
            publisher:recipe.publisher,
            image_url:recipe.image_url,
            ...(recipe.key && { key: recipe.key })
         }
      })

      state.search.page = 1;
   }catch (err) {
      throw err;
   }
}

export const getSearchResultsPage = function(page = state.search.page){
   state.search.page = page;

   const start = (page - 1) * state.search.resultsPerPage;
   const end = page * state.search.resultsPerPage;

   return state.search.results.slice(start, end)
}

export const updateServings = function(newServings) {
   state.recipe.ingredients.forEach(ingredient => {
      ingredient.quantity = (ingredient.quantity * newServings) / state.recipe.servings;
   })

   state.recipe.servings = newServings;
}

const persistBookmarks = function () {
   localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks))
}

export const addBookmark = function(recipe) {

   state.bookmarks.push(recipe);

   if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

   persistBookmarks();
}

export const deleteBookmark = function(id) {
   const index = state.bookmarks.findIndex(element => { element.id == id });
   state.bookmarks.splice(index, 1)
   if(id === state.recipe.id) state.recipe.bookmarked = false;

   persistBookmarks();
}

const init = function () {
   const storage = localStorage.getItem('bookmarks');
   if(storage) state.bookmarks = JSON.parse(storage)
}
init();

export const uploadRecipe = async function(newRecipe){
   try{
      const ingredients = Object.entries(newRecipe).filter(entry => 
         entry[0].startsWith('ingredient') && entry[1] !== ''
      ).map(ing => {
         const ingArray = ing[1].split(',').map(element => element.trim())
         if(ingArray.length !== 3) throw new Error('Wrong ingredient format! Please use the correct format :)')
   
         const [ quantity, unit, description ] = ingArray;
         return { quantity: quantity ? +quantity: null, unit, description}
      })

      const recipes = {
         title: newRecipe.title,
         source_url: newRecipe.sourceUrl,
         image_url: newRecipe.image,
         publisher: newRecipe.publisher,
         cooking_time: +newRecipe.cookingTime,
         servings: +newRecipe.servings,
         ingredients
      }

      const { recipe } = await AJAX(`${API_URL}?key=${KEY}`, recipes);
      createRecipeObject(recipe);
      addBookmark(state.recipe);
      
   }catch(err){
      throw err;
   }


}

