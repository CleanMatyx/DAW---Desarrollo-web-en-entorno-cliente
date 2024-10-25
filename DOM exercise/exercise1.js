/*****
 * DOM - Exercise 1
 * 
 * Cuando un usuario haga click en un div dentro del elemento div.container, añade o quita (toggle) la clase CSS
 * "selected". 
 * El elemento button#delete borrará todos los divs seleccionados del DOM.
 */

let input = document.querySelector("div.container");
input.addEventListener("click", function(event) {
    event.target.classList.toggle("selected");
});

document.getElementById("delete").addEventListener("click", (e) => {
    document
    .querySelectorAll(".container > div.selected")
    .forEach((div) => div.remove());
})
