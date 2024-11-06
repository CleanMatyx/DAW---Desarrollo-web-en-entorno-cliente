/*****
 * DOM - Exercise 2
 * 
 * Cuando un usuario haga click sobre un div dentro del elemento div.container, añade o quita la clase CSS "selected".
 * Esta vez SOLO 1 div puede tener esa clase al mismo tiempo (quitala de otros elmentos cuando sea necesario)
 * 
 * El elemento button#insert-before creará un div NUEVO con el texto del elemento input#text antes 
 * del div seleccionado o al principio del elemento div.container si no hay nada selccionado (no 
 * olvides el evento de click del nuevo div).
 * 
 * El elemento button#insert-after hará lo mismo que el anterior pero lo insertará después del elemento seleccionado
 * o al principio de div.container si no hay nada selccionado.
 * 
 * El elemento button#replace, creará un NUEVO div con el texto y lo reemplazará por el seleccionado. Si no hay ninguno
 * seleccionado no hagas nada.
 * 
 * El elemento button#delete borrará el div seleccionado (si hay alguno)
 * 
 * El elemento button#clear borrará todo dentro de div.container.
 * 
 * NO USES innerHTML!!!!
 */

function divClick(e) {
    const selected = document.querySelector(".container > div.selected");
    if(selected && selected !== this) {
        selected.classList.remove("selected");
    }
    this.classList.toggle("selected");
}

const container = document.querySelector(".container");
const input = document.getElementById("text");
const btnInsertBefore = document.getElementById("insert-before");
const btnInsertAfter = document.getElementById("insert-after");
const btnReplace = document.getElementById("replace")
const btnRemove = document.getElementById("remove");
const btnClear = document.getElementById("clear");


function createDiv(text) {
    const div = document.createElement("div");
    div.textContent = text;
    div.addEventListener("click", divClick);
    return div;
}