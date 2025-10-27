"use client";

import { useState, useEffect } from "react";

export default function Home() {
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

  const [targetWord, setTargetWord] = useState(""); //use estate declara variable y funcion para actualizarla
  const [letters, setLetters] = useState<string[]>([]);


  const initGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord.split("").sort(() => Math.random() - 0.5); //ordenar random despues de dividir
    setTargetWord(randomWord);
    setLetters(shuffled);
  };

  //en use effect se pone todo lo que se quiera al inicializar el componente, importante tenerlo en cuenta si uso esta libreria
  useEffect(() => {
    initGame();
  }, []);

  //Función para mover una letra
  const moveLetter = (index: number, direction: "izq" | "der") => {
    const newLetters = [...letters]; //letters no se puede modificar al ser un estado perse, se necesita de otra variable (por eso el setLetters)
    const newIndex = direction === "izq" ? index - 1 : index + 1;

    // Evita moverse fuera de los límites
    if (newIndex < 0 || newIndex >= newLetters.length) return;

    // Intercambia letras
    [newLetters[index], newLetters[newIndex]] = [ //destructurado de javascript hace un swap de datos (como en C con una variable temporal)
      newLetters[newIndex],
      newLetters[index],
    ];

    setLetters(newLetters);

    // Verifica si ya está ordenada
    
    if (newLetters.join("") === targetWord) { //join convierte el arreglo a string
      alert("¡Palabra ordenada!");
      //initGame();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center justify-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Ordena la palabra
        </h1>

        <div className="flex flex-row gap-2">
          {letters.map((letter, index) => ( //mapear el arreglo de letras -- similar a ngfor
            <div
              key={index} //necesario poner el index para que react reconozca.
              className="flex items-center justify-between bg-zinc-200 dark:bg-zinc-800 rounded-lg px-4 py-2"
            >
              <span className="text-xl text-black dark:text-white">{letter}</span>

              <div className="flex gap-1">
                <button
                  onClick={() => moveLetter(index, "izq")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  ←
                </button>
                <button
                  onClick={() => moveLetter(index, "der")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={initGame}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Nueva palabra
        </button>
      </main>
    </div>
  );
}