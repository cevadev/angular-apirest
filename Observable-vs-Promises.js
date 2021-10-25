/**
 * Clase donde ejemplificamos porque angular utiliza el patron Observable
 */

// importamos la biblioteca para trabajar con el patron Observable
const { Observable } = require("rxjs");
// importamos filter para filtrar los datos que vienen de un Observable
const { Filter } = require("rxjs/operators");

// funcion doSomething retorna un promesa
const doSomething = () => {
  // retonamos la promesa. Toda promesa tiene dos estados: resolve or reject
  return new Promise((resolve) => {
    // una vez creada la promesa la resolvemos
    resolve("from promises: valor 1");
  });
};

// ejecutamos nuestra promesa dentro de un contexto asincrono. hacemos que la funcion se llame sola
(async () => {
  const rptaPromise = await doSomething();
  console.info(rptaPromise);
})();

// Creamos un Observable
const doSomething$ = () => {
  return new Observable((observer) => {
    // emitimos un valor con el metodo next()
    // una ventaja de los Observables nos permte emitir varios datos
    observer.next("from Observable: valo 1");
    observer.next("from Observable: valo 2");
    observer.next("from Observable: valo 3");
    // el observer nos enviará valores nulos pero los vamos a filtaer utilizando pipes y filter
    observer.next(null);
    setTimeout(() => {
      observer.next("from Observable: valor 4");
    }, 5000);
    setTimeout(() => {
      observer.next(null);
    }, 8000);
    setTimeout(() => {
      observer.next("from Observable: valor 5");
    }, 10000);
  });
};

// creamos el contexto ejecutable automático para nuestro Observable
(() => {
  const observable$ = doSomething$();
  // nos suscribimos al observable
  observable$
    .pipe(
      // filtramos todos los valores nulos que emite el observable
      filter((value) => value !== null)
    )
    .subscribe((rptaObservable) => {
      // obtenemos la respuesta del observable y la imprimimos
      console.info(rptaObservable);
    });
})();
