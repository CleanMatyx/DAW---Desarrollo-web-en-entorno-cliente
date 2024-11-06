/**
 * Parte 1
 * Crea una función que tome una cadena como entrada y compruebe si es un palíndromo (es igual cuando se invierte).
 * Haz esto sin usar bucles (puedes usar Array.from para convertir una cadena en un array).
 * Comprueba que el tipo del parámetro es "string" y que la longitud es al menos 1 o muestra un error.
 * Ejemplo: esPalindromo("abeceba") -> true
 */

console.log("EJERCICIO 1 - PARTE 1");

function esPalindromo(cadena) {
    if (cadena.length < 1) {
        throw new Error('La cadena debe tener al menos un caracter');
    }
    let cadenaAlReves = Array.from(cadena).reverse().join('');
    return cadenaAlReves === cadena;
}

console.log(esPalindromo("abeceba"));
console.log(esPalindromo("pepe"));
console.log("\n");


/**
 * Parte 2
 * Desarrolla una función que comprima una cadena reemplazando caracteres repetitivos consecutivos con
 * el carácter y el número de repeticiones. Por ejemplo, "AAAABBBCC" se convertiría en "4A3B2C".
 * Ejemplo: stringCompression("GGGHHRRRRRRRUIIIOOOO") -> 3G2H7R1U3I4O
 */

console.log("EJERCICIO 1 - PARTE 2");

function comprimirLetras(cadena) {
    let cadenaComprimida = '';
    let contador = 1;

    for (let i = 0; i < cadena.length; i++) {
        if (cadena[i] === cadena[i + 1]) {
            contador++;
        } else {
            cadenaComprimida += contador + cadena[i];
            contador = 1;
        }
    }

    return cadenaComprimida;
}

console.log(comprimirLetras("GGGHHRRRRRRRUIIIOOOO"));
console.log(comprimirLetras("AAAABBBCC"));
console.log("\n");

/**
 * Parte 3
 * Crea una función que tome un array de números que contenga valores duplicados. Debería devolver el
 * primer número que se repite en el array, o -1 si no hay duplicados.
 * No uses bucles, y si no sabes cómo hacerlo sin bucles, solo puedes usar un bucle
 * (.forEach cuenta como un bucle).
 * Ejemplo: encuentraRepetido([1,4,7,3,8,7,4,5,5,1]) -> 7 (se repite antes que el 4)
 */

console.log("EJERCICIO 1 - PARTE 3");

function encuentraRepetido(numeros) {
    let numerosUnicos = new Set();
    let repetido = -1;
    numeros.find(numero => {
        if (numerosUnicos.has(numero)) {
            return repetido = numero;
        }
        numerosUnicos.add(numero);
    });
    return repetido;
}

console.log(encuentraRepetido([1,4,7,3,8,7,4,5,5,1]));
console.log(encuentraRepetido([1,2,3]));
console.log("\n");

/**
 * Parte 4
 * Crea una función que tome un array de cadenas como primer parámetro y una cadena como segundo.
 * Debería devolver un nuevo array que contenga las palabras del primer array cuyas letras estén todas presentes
 * en la segunda cadena. Intenta no usar bucles a no ser que no sepas hacerlo de otra manera.
 * Ejemplo: fitraPalabras(["house", "car", "watch", "table"], "catboulerham") -> ['car', 'table']
 */

console.log("EJERCICIO 1 - PARTE 4");

function filtraPalabras(palabras, cadena) {
    return palabras.filter(palabra => {
        let letras = Array.from(palabra);
        return letras.every(letra => cadena.includes(letra));
    });
}

let palabras = ["house", "car", "watch", "table"];
let cadena = "catboulerham";
let palabrasEnCadena = filtraPalabras(palabras, cadena);

console.log(palabrasEnCadena);
console.log("\n");



/**
 * Parte 5
 * Crea una función que tome un array de luces representadas por los caracteres '🔴' y '🟢'.
 * La función debe comprobar si las luces están alternando (por ejemplo, ['🔴', '🟢', '🔴', '🟢', '🔴']).
 * Devuelve el número mínimo de luces que necesitan ser cambiadas para que las luces alternen.
 * Ejemplo: ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢'])  -> 1 (cambia la primera luz a verde)
 */
console.log("EJERCICIO 1 - PARTE 5");

function ajustaLuces(luces) {
    let ajustes = 0;
    for (let i = 0; i < luces.length - 1; i++) {
        if (luces[i] === luces[i + 1]) {
            ajustes++;
        }
    }
    return ajustes;
}

console.log(ajustaLuces(['🔴', '🔴', '🟢', '🔴', '🟢']));
console.log(ajustaLuces(['🔴', '🟢', '🔴', '🟢', '🔴']));
console.log(ajustaLuces(['🟢', '🔴', '🟢', '🔴', '🟢']));
console.log("\n");



/**
 * Parte 5
 * Crea una colección Map donde la clave es el nombre de un plato y el valor es un array de ingredientes.
 * Realiza el código para crear otro Map donde la clave sea el nombre del ingrediente y el valor sea el array de
 * platos donde aparece ese ingrediente.
 */

console.log("EJERCICIO 1 - PARTE 6");

let platos = new Map([
    ['empanadas', ['carne picada', 'pimientos', 'cebolla', 'huevos']],
    ['tortilla', ['patatas', 'huevos', 'cebolla']],
    ['pizza', ['harina', 'tomate', 'queso', 'pepperoni']],
    ['ensalada', ['lechuga', 'tomate', 'pepino', 'aceitunas']],
    ['pasta', ['pasta', 'tomate', 'queso', 'albahaca', 'carne picada']]
]);

let ingredientes = new Map();

platos.forEach((ingredientePlato, nombrePlato) => {
    ingredientePlato.forEach(ingrediente => {
        if (ingredientes.has(ingrediente)) {
            ingredientes.get(ingrediente).push(nombrePlato);
        } else {
            ingredientes.set(ingrediente, [nombrePlato]);
        }
    });
});

console.log(ingredientes);
console.log("\n");

/**
 * Parte 7
 * Crea una función que pueda recibir tantos números como quieras por parámetro. Utiliza rest para agruparlos en
 * un array e imprimir los que son pares y los que son impares por separado.
 * NO uses bucles (for, while, etc.)
 */

console.log("EJERCICIO 1 - PARTE 7");

function separaParesImpares(...numeros) {
    let pares = numeros.filter(numero => numero % 2 === 0);
    let impares = numeros.filter(numero => numero % 2 !== 0);
    console.log('Pares:', pares);
    console.log('Impares:', impares);
}

separaParesImpares(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
console.log("\n");


/**
 * Parte 8
 * Crea una función que reciba un array y sume los primeros tres números del array.
 * Utiliza desestructuración de arrays en los parámetros para obtener esos tres números.
 * Si alguno de esos números no está presente en el array, se asignará un valor predeterminado de 0.
 * Devuelve el resultado de sumar esos tres números.
 */

console.log("EJERCICIO 1 - PARTE 8");

function sumaTresPrimeros(numeros) {
    return numeros[0] + numeros[1] + numeros[2];
}

console.log(sumaTresPrimeros([1, 2, 3, 4, 5]));
console.log('\n');

/**
 * Crea una función que tome un número indeterminado de cadenas como argumentos,
 * las agrupa en un array y devuelve un nuevo array que contiene la longitud de cada cadena.
 * No uses bucles.
 * Ejemplo: stringLenghts("potato", "milk", "car", "table") -> [6, 4, 3, 5]
 */

console.log("EJERCICIO 1 - PARTE 9");

function longitudCadenas(...cadenas) {
    return cadenas.map(cadena => cadena.length);
}

console.log(longitudCadenas("potato", "milk", "car", "table"));
console.log("\n");

/**
 * Parte 10
 * Crea un array y, sin modificarlo, genera los siguientes arrays derivados (cada nuevo array deriva del anterior):
 * - Agrega 2 elementos al principio del array
 * - Elimina las posiciones 4 y 5
 * - Concatena los elementos de otro array al final Muestra el array resultante después de cada operación.
 * Ninguna operación realizada debe modificar el array sobre el que opera. Muestra el array original al final.
 */

console.log("EJERCICIO 1 - PARTE 10");

let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let array2 = [-1, 0, ...array];

let array3 = array2.filter(posicion => posicion !== 4 && posicion !== 5);

let array4 = [...array3, 11, 12];

console.log(array);
console.log(array2);
console.log(array3);
console.log(array4);


