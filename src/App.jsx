import React from 'react'
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

import './App.css'


// track the numer of rolls, 
// track the time it took to win, 
// save your best time to localStorage

function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [time, setTime] = React.useState(0)
  const [isTimeRunning, setIsTimeRunning] = React.useState(true)

  React.useEffect(() => {
    let intervalId
    if (isTimeRunning){
      intervalId = setInterval(() => setTime(time + 1), 10)
    }
    if (tenzies){
      setIsTimeRunning(false)
    } 
    return () => clearInterval(intervalId)
  }, [time, isTimeRunning])

  const minutes = Math.floor(time % 360000 / 6000).toString().padStart(2, "0")
  const seconds = Math.floor((time%6000) / 100).toString().padStart(2, "0")
 
  React.useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      if (allHeld && allSameValue) {
          setTenzies(true)
      }
  }, [dice])

  function generateNewDie() {
      return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid()
      }
  }
  
  function allNewDice() {
      const newDice = []
      for (let i = 0; i < 10; i++) {
          newDice.push(generateNewDie())
      }
      return newDice
  }
  
  function rollDice() {
      if(!tenzies) {
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
          setCount(prevCount => prevCount + 1)
      } else {
          setTenzies(false)
          setCount(0)
          setDice(allNewDice())
          setTime(0)
          setIsTimeRunning(prevState => !prevState)
      }
  }
  
  function holdDice(id) {
      setDice(oldDice => oldDice.map(die => {
          return die.id === id ? 
              {...die, isHeld: !die.isHeld} :
              die
      }))
  }

  const diceElements = dice.map(die => (
      <Die 
          key={die.id} 
          value={die.value} 
          isHeld={die.isHeld} 
          holdDice={() => holdDice(die.id)}
      />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <p className='rollsntime'> 
        # of rolls: <span className='green-font bold-text'> {count} </span>  &nbsp; &nbsp; 
        Time: {minutes} : {seconds} </p>
      <button 
        className="roll-dice" 
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
</main>
  )
}

export default App
