import { useState, useEffect} from 'react'
import './App.css'
import StartMenu from './components/StartMenu';
import blueBlob from './imgs/blob-blue.png'
import yellowBlob from './imgs/blob-yellow.png'
import QuestionEntry from './components/QuestionEntry';

function App() {
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [answeredChecked, setAnsweredChecked] = useState(false)
  const [startNewGame, setStartNewGame] = useState(false)
  const [startMenu, setStartMenu] = useState(true)

  
    useEffect(()=> {
      const fetchData = async() => {
        try {const res = await fetch('https://opentdb.com/api.php?amount=5')
          if(res.status === 429) {
            throw new Error('too many requests')       
          }
          if(!res.ok) {
            throw new Error('Error')
          }
          const data = await res.json()
          handleData(data.results)
        } catch (error) {
          alert('Please try again in a few seconds')
        }
    }
    if(!startMenu)
        {fetchData()       
      }
  },[startNewGame, startMenu])

  function flipStartMenu () {
    setStartMenu(prev => !prev)
  }

  function handleData(data) {
    let tempCorrectArr = []
    const mappedData = data.map((item) =>{
      tempCorrectArr.push(item.correct_answer)
      return [item.question,shuffleArray([...item.incorrect_answers
              , item.correct_answer])]
    })
    setQuestions(mappedData)
    setSelected(new Array(questions.length).fill(undefined))
    setCorrectAnswers(tempCorrectArr)
}

  function shuffleArray(array) {
        return array
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);
}


   const questionElementsArr = questions.map((entry, index)=> {
        return <QuestionEntry index={index} key={entry[0]} questionText={entry[0]} 
        answersArray={entry[1]}
        selected={selected}
        handleAnswerSelection = {handleAnswerSelection}
        answeredChecked={answeredChecked}
        correctAnswers={correctAnswers}/>
    })
    
    function handleAnswerSelection(el, index) {
    setSelected(prev => {
     const  newArray = [...prev]
      newArray[index] = el
      return newArray     
    })}

    function handleCheckAnswers() {
      if(selected.length === questions.length) {
        selected.every(item => item !== undefined) ? setAnsweredChecked(true) :
        alert('Please selected an answer to all questions')
       }
       else {
        alert('Please selected an answer to all questions')
       }
    }

    function countAnswers() {
    let correctAnswersCount = 0
    selected.map((value, index)=>{
       correctAnswers[index] === value && correctAnswersCount++
    })

    return correctAnswersCount
  }

  function restartGame() {
    setSelected(new Array(questions.length).fill(undefined))
    setAnsweredChecked(false)
    setStartNewGame(prev => !prev)
  }

  return (
    
    <main className='relative overflow-hidden'>
        <img className='absolute -top-30 -right-30 -z-1' src={yellowBlob} aria-hidden="true" alt=""/>
        <img className='absolute -bottom-20 -left-25 -z-1' src={blueBlob} aria-hidden="true" alt=""/>
     { startMenu ? <StartMenu flipStartMenu ={flipStartMenu}/> :<>
      <section className='h-[90%] flex flex-col items-center justify-center'>
        {questionElementsArr}
      </section>
      <section className='flex gap-5 justify-center items-center my-2 sm:my-5 sm:gap-10'>
        {answeredChecked && <p
          className='font-bold text-[#293264]'
        >You scored {countAnswers()}/5 correct answers</p>}
        <button
          className='w-40 bg-[#4D5B9E] rounded-lg h-[50px] text-[#F5F7FB]'
          onClick={answeredChecked ? restartGame : handleCheckAnswers}>{answeredChecked ? 'Start new Game' : 'Check answers'}</button>
      </section>
      </>
      }
     </main>
     
    
  );
}

export default App;
