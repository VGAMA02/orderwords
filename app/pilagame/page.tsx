"use client";

import { useState, useEffect } from "react";
import styles from './pilagame.module.scss';

export default function PagePilaGame() {

  const words = [
    "perro",
    "caballo",
    "tortuga",
    "delfin",
    "canguro",
    "gato",
    "lagartija",
    "iguana",
    "loro",
    "guacamaya",
    "marmota",
    "erizo",
  ];
 //"flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black"
  const [targetWord, setTargetWord] = useState(""); //use estate declara variable y funcion para actualizarla
  const [lettersUp, setlettersUp] = useState<string[]>([]);
  const [lettersDown, setlettersDown] = useState<string[]>([]);
  const [points, setPoints] = useState(0); //use estate declara variable y funcion para actualizarla
const [lives, setLives] = useState(3);//use estate declara variable y funcion para actualizarla

//? Tanke: separo la logica de perder vida
const loseLife = () => {
  if (lives > 0) {

      setLives(prev => {
        const newLives = prev - 1;
        if (newLives < 1) {
          setPoints(0);
          return 3;
        }
        return newLives;
      });

  }
};

const initGame = (estado?: number) => {
  const randomWord = getRandomWord();
  const shuffled = shuffledWordAndSepared(randomWord);
  setTargetWord(randomWord);
  setlettersDown(shuffled);
  setlettersUp([]);

  //!Evitar ifs anidados
  if ( estado != null && estado === 1)
    return setPoints(p => p + 100);
  return loseLife();
    
  
};

  //? Tanke: separando la optencion random de las palatbas para en un futuro si es necesario cambiarlo a una optencion externa y modificar lo menos posible
  const getRandomWord  = ():string =>  words[Math.floor(Math.random() * words.length)];
  //? Tanke: Mejorando un poco el mezclado de las palabras para tomar en cuenta casos donde no se puede
 const shuffledWordAndSepared = (word: string): string[] => {
  const chars = [...word];

  // Imposible de mezclar
  if (chars.length < 2 || chars.every(c => c === chars[0])) {
    throw new Error("No se puede mezclar");
  }

  // Hasta 4 intentos con el sort aleatorio
  for (let i = 0; i < 4; i++) {
    const newWord = [...chars].sort(() => Math.random() - 0.5);
    if (newWord.join("") !== word) return newWord;
  }

  // Fallback: forzar diferencia con un swap sencillo
  const k = chars.findIndex(c => c !== chars[0]);
  if (k !== -1) {
    [chars[0], chars[k]] = [chars[k], chars[0]];
    return chars;
  }

  throw new Error("No se puede mezclar");
};
  const resetGame = () => {
    const shuffled = targetWord.split("").sort(() => Math.random() - 0.2); //ordenar random despues de dividir
    setlettersDown(shuffled);
    setlettersUp([]);
    let newLives = (lives - 1);
    if (newLives < 1) {
      newLives = 3
      setPoints(0)
    }
    setLives(newLives)


  }

  //en use effect se pone todo lo que se quiera al inicializar el componente, importante tenerlo en cuenta si uso esta libreria
  useEffect(() => {
    initGame();
  }, []);

// Sube una letra desde lettersDown[ind] al siguiente slot libre (al final de lettersUp)
const moveLetterUpFromDown = (ind: number) => {
  if (lettersUp.length >= targetWord.length) return;

  const down = [...lettersDown];
  const char = down.splice(ind, 1)[0];
  if (!char) return;

  const up = [...lettersUp, char];
  setlettersDown(down);
  setlettersUp(up);
};
//TODO: No poder bajar letras si ya tienes todas arriba
// Baja la letra del slot i de lettersUp y la regresa a lettersDown
const moveLetterDownAtIndex = (i: number) => {
  if (i < 0 || i >= lettersUp.length) return;

  const up = [...lettersUp];
  const [char] = up.splice(i, 1);
  const down = [...lettersDown, char];

  setlettersUp(up);
  setlettersDown(down);
};



  return (<main className="min-h-screen bg-zinc-50 dark:bg-black">
  {/* Barra superior: puntos + vidas */}
  <header
    className={`sticky top-0 z-10 ${styles.points} flex items-center justify-center gap-8 px-4 py-3
    bg-zinc-50/80 dark:bg-black/80 backdrop-blur supports-[backdrop-filter]:bg-zinc-50/60`}
  >
    <div className="flex items-center gap-2">
      <h2 className="font-medium">Puntos</h2>
      <div className="flex items-center gap-2" aria-live="polite">
        <img className={`${styles.icon_header} `} src="/trophy.png" alt="Trofeo" />
        <span className="text-lg font-semibold">{points}</span>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <h2 className="font-medium">Vidas</h2>
      <div className="flex items-center gap-1" role="img" aria-label={`Vidas: ${lives}`}>
  {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
    <img
      key={i}
      className={`${styles.icon_header} `}
      src="/Heart.png"
      alt="Corazón"
    />
  ))}
</div>
    </div>
  </header>

  <div className="container mx-auto px-4 py-8 md:py-12">
<section className="mx-auto w-full max-w-[900px] rounded-2xl bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-md">

      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black dark:text-white  text-center">
        Ordena la palabra
      </h1>

     {/* Slots interactivos (arriba): se rellenan con lettersUp */}
<div className="mb-4 flex justify-center flex-wrap gap-3">
  {Array.from({ length: targetWord.length }).map((_, i) => {
    const char = lettersUp[i];
    const ok = char && char === targetWord[i];

    return (
      <button
        type="button"
        key={i}
        onClick={() => (char ? moveLetterDownAtIndex(i) : undefined)}
        className={[
          "w-10 h-12 rounded-lg flex items-center justify-center text-xl",
          char
            ? ok
              ? "bg-zinc-200 dark:bg-green-500/80 text-black"
              : "bg-zinc-800 dark:bg-red-700 text-white"
            : "px-2 pb-1 text-center border-b-2 border-dashed border-zinc-400 dark:border-zinc-600"
        ].join(" ")}
      >
        {char ?? ""}
      </button>
    );
  })}
</div>

<div className="flex flex-wrap gap-2 items-center justify-center">
  {lettersDown.map((letter, index) => (
    <button
      type="button"
      key={`${letter}-${index}`}
      onClick={() => moveLetterUpFromDown(index)}
      className="rounded-lg px-4 py-2 text-xl bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white transition-colors"
    >
      {letter}
    </button>
  ))}
</div>


      {/* Acciones */}
      <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
        <button
          onClick={() => (lettersUp.join("") === targetWord ? initGame(1) : initGame(-1))}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Nueva palabra
        </button>

        {lettersDown[0] == null && lettersUp.join("") !== targetWord && (
          <button
            onClick={resetGame}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Intentar de nuevo
          </button>
        )}
      </div>
    </section>
  </div>
</main>

  );
}