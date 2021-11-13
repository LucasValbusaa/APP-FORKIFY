import icons from 'url:../../img/icons.svg';

export default class View {
   _data;
  
   render(data, render = true){
      if(!data || (Array.isArray(data) && data.length === 0)) return this.renderErro(); 

      this._data = data;
      const markup = this._generateMarkup();

      if(!render) return markup;

      this._clear()
      this._addMarkup(markup);
    }

    update(data) {
      this._data = data;
      const newMarkup = this._generateMarkup();

      const newDOM  = document.createRange().createContextualFragment(newMarkup);
      const newElements = Array.from(newDOM.querySelectorAll('*'));
      const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

      newElements.forEach((newEl, index) => {
        const currEl = currentElements[index];
        
        //Update change text
        if(!newEl.isEqualNode(currEl) && newEl.firstChild && newEl.firstChild.nodeValue.trim() !== ''){
          currEl.textContent = newEl.textContent;
        }

        //Update change atributs
        if(!newEl.isEqualNode(currEl)){
          Array.from(newEl.attributes).forEach(atribute =>
            currEl.setAttribute(atribute.name, atribute.value)
          )
        }
      }) 
    }
  
     _clear(){
        this._parentElement.innerHTML = '';
     }
  
     _addMarkup(markup){
      this._parentElement.insertAdjacentHTML('afterbegin', markup)
     }
  
     renderSpninner(){
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
        this._clear();
        this._addMarkup(markup);
      };
  
      renderErro(message = this._errorMessage) {
        const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `
        this._clear();
        this._addMarkup(markup);
      }
  
      successMessage(message = this._successMessage) {
        const markup = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `
        this._clear();
        this._addMarkup(markup);
      }
}