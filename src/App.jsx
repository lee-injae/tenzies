import React from 'react'
import Die from "./components/Die/Die"
import Button from "./components/Button/Button"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

import './App.css'

function App() {
  const savedBestTime = localStorage.getItem("myBestTime")
  const initialBestTime = savedBestTime ? Number(savedBestTime) : 999999
  const [myBestTime, setMyBestTime] = React.useState(initialBestTime)
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [time, setTime] = React.useState(0)
  const [isTimeRunning, setIsTimeRunning] = React.useState(false)
  const [achievedNewBest, setAchievedNewBest] = React.useState(false)
  
  React.useEffect(() => {
    if (savedBestTime) {
      setMyBestTime(Number(savedBestTime))
    } else {
      setMyBestTime(999999)
    }
  }, [])

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

  const minutes = Math.floor( (time % 360000) / 6000).toString().padStart(2, "0")
  const seconds = Math.floor( (time % 6000) / 100).toString().padStart(2, "0")
 
  React.useEffect(() => {
      const allHeld = dice.every(die => die.isHeld)
      const firstValue = dice[0].value
      const allSameValue = dice.every(die => die.value === firstValue)
      if (allHeld && allSameValue) {
          setTenzies(true)
      }
  }, [dice])

  React.useEffect(() => {
    if (myBestTime > 0){
      localStorage.setItem("myBestTime", myBestTime.toString())
    }
  }, [myBestTime])

  React.useEffect(() => {
    if (tenzies) {
      if(myBestTime > time) {
        // console.log("Setting new best time and achievedNewBest to true");
        setMyBestTime(time)
        setAchievedNewBest(true)
      } else {
        // console.log("No new best time achieved");
        setAchievedNewBest(false)
      }
    }
  }, [tenzies])

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
      if(!tenzies && isTimeRunning) {
          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                  die :
                  generateNewDie()
          }))
          setCount(prevCount => prevCount + 1)
      } else if (tenzies) {
          resetGame()
      }
  }

  function resetGame(){
    setCount(0)
    setTime(0)
    setTenzies(false)
    setDice(allNewDice())
  }

  const myBestMinutes = Math.floor( (myBestTime % 360000) / 6000).toString().padStart(2, "0")
  const myBestSeconds = Math.floor( (myBestTime % 6000) / 100).toString().padStart(2, "0")
  const disPlayBestTime = myBestTime === 999999 ? "N / A" : `${myBestMinutes} : ${myBestSeconds}`

  function holdDice(id) {
      if (time != 0){
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
      }))
    }
  }

  function startGame(){
      setIsTimeRunning(true)
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
      { tenzies && achievedNewBest && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <p className='rollsntime'> 
        # of rolls: <span className='green-font bold-text'> {count} </span>  &nbsp; &nbsp; 
        <span> Time: {minutes} : {seconds} </span> &nbsp; &nbsp;
         My best time: <span className='red-font'> {disPlayBestTime} </span>   
      </p>
      { (!isTimeRunning && !tenzies) && <Button
        onClick={startGame}
      >
        Start
      </Button>}
      <button 
        className="roll-dice" 
        onClick={rollDice}
      >
        {tenzies ? "Back to main" : "Roll"}
      </button>
</main>
  )
}

export default App
