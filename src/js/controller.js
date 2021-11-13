import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './confing.js';


import 'core-js/stable';
import 'regenerator-runtime/runtime';


const controlRecipes = async function(){
 
  try{
    const id = window.location.hash.slice(1);
    if(!id) return;

    recipeView.renderSpninner();

    resultsView.update(model.getSearchResultsPage());
   
    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

    bookmarksView.update(model.state.bookmarks);
    console.log(model.state.recipe);
  }catch(err){
   recipeView.renderErro();
  }

};

const controlSearchResults = async function(){
  try {
    resultsView.renderSpninner();
 
    const query = searchView.getQuery();
    if(!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage())

    paginationView.render(model.state.search)
  }catch (err) {
    throw err;
  }
}

const controlPagination = function(goToPage){
  resultsView.render(model.getSearchResultsPage(goToPage))
  paginationView.render(model.state.search)
}

const controlServings = function(newServings){
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){

  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else model.deleteBookmark(model.state.recipe.id)
  
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
  try{
    addRecipeView.renderSpninner();

    await model.uploadRecipe(newRecipe)
    
    recipeView.render(model.state.recipe)
    
    addRecipeView.successMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function(){
      addRecipeView.toggleWindow()
    }, MODAL_CLOSE_SEC * 1000)
  }catch(err){
    console.error(err);
    addRecipeView.renderErro(err.message)
  }
  
}

const init = function (){
  bookmarksView.addHandlerRender(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
};

init();


