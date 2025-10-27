"use client";

import { useState, useEffect } from "react";
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
  const [lives, setLives] = useState(3); //use estate declara variable y funcion para actualizarla


  const initGame = (estado?: Number) => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const shuffled = randomWord.split("").sort(() => Math.random() - 0.2); //ordenar random despues de dividir
    setTargetWord(randomWord);
    setlettersDown(shuffled);
    setlettersUp([]);

    if (estado != null) {
      if (estado == 1) {
        const newPoints = + (points + 100);
        setPoints(newPoints);
      }
      else {
        let newLives = (lives - 1);
        if (newLives < 1) {
          newLives = 3

          setPoints(0)
        }
        setLives(newLives)
      }
    }
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

  //Función para mover una letra arriba
  const moveLetterUp = (index: number) => {
    const newLettersDown = [...lettersDown]; //letters no se puede modificar al ser un estado perse, se necesita de otra variable (por eso el setLetters)
    const letra = newLettersDown.splice(index, 1)[0];

    const newLettersUp = [...lettersUp];
    newLettersUp.push(letra)

    setlettersUp(newLettersUp);
    setlettersDown(newLettersDown);
    // Verifica si ya está ordenada

    if (newLettersUp.join("") === targetWord) { //join convierte el arreglo a string
      alert("¡Palabra ordenada!");
      //initGame();
    }
  };

  const moveLetterDown = (index: number) => {
    const newLettersUp = [...lettersUp]; //letters no se puede modificar al ser un estado perse, se necesita de otra variable (por eso el setLetters)
    const letra = newLettersUp.pop() || '';

    if (letra == '') return;

    const newLettersDown = [...lettersDown];
    newLettersDown.push(letra)

    setlettersUp(newLettersUp);
    setlettersDown(newLettersDown);

  }


  return (
    <section className="bg-zinc-50 dark:bg-blacks">
      <div className="flex flex-row bg-zinc-50 dark:bg-black justify-center">
        <h2 className="p-2">Puntos: {points} </h2>
        <h2 className="p-2">Vidas: {lives} </h2>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black" >


        <main className="flex flex-col justify-center bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Ordena la palabra
          </h1>



          <div className="flex flex-row gap-3" >
            {lettersUp.map((letter, index) => ( //mapear el arreglo de letras -- similar a ngfor
              <div onClick={() => lettersDown[0] != null ? moveLetterDown(index) : null}
                key={index} //necesario poner el index para que react reconozca.
                className={
                  lettersDown[0] != null
                    ? "flex items-center justify-between bg-zinc-200 dark:bg-zinc-800 rounded-lg px-5 py-2 cursor-pointer"
                    :
                    letter == targetWord[index]
                      ? "flex items-center justify-between bg-zinc-200 dark:bg-green-400 rounded-lg px-5 py-2 cursor-pointer"
                      : "flex items-center justify-between bg-zinc-800  dark:bg-red-800 rounded-lg px-5 py-2 cursor-pointer"
                }
              >
                <span className="text-xl text-black dark:text-white">{letter}</span>
              </div>
            ))}



          </div>


          <div className="flex flex-row">
            {Array.from(targetWord).map((_, index) => (
              <div key={index} className="flex px-2">
                <p className="flex gap-1 px-1">____</p>
              </div>
            ))}
          </div>

          <br></br>

          <div className="flex flex-row gap-2">
            {lettersDown.map((letter, index) => ( //mapear el arreglo de letras -- similar a ngfor
              <div onClick={() => moveLetterUp(index)}
                key={index} //necesario poner el index para que react reconozca.
                className="flex items-center bg-zinc-200 dark:bg-zinc-800 rounded-lg px-4 py-2 cursor-pointer"
              >
                <span className="text-xl text-black dark:text-white">{letter}</span>
              </div>
            ))}
          </div>

          <button

            onClick={() => lettersUp.join("") === targetWord ? initGame(1) : initGame(-1)}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Nueva palabra
          </button>


          {lettersDown[0] == null && (lettersUp.join("") !== targetWord) && (
            <button
              onClick={resetGame}
              className="mt-6 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Intentar de nuevo
            </button>
          )}




        </main>


      </div>
    </section>
  );
}