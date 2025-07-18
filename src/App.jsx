import { useState, useEffect} from 'react'
import StartMenu from './components/StartMenu'
import blueBlob from './imgs/blob-blue.png'
import yellowBlob from './imgs/blob-yellow.png'
import QuestionEntry from './components/QuestionEntry'
import categoriesData from './categoriesData.js'
import Select from 'react-select'
function App() {
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [answeredChecked, setAnsweredChecked] = useState(false)
  const [startNewGame, setStartNewGame] = useState(false)
  const [startMenu, setStartMenu] = useState(true)
  const [quizOptions, setQuizOptions] = useState(['',''])
  const difficultyOptions = [
        {value:false, label: "All"},
        {value:"easy", label: "Easy"},
        {value:"medium", label: "Medium"},,
        {value:"hard", label: "Hard"},
    ]
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#F5F7FB",
      boxShadow: 'none',
    }),
    option: (provided, state) => ({
      ...provided,
      color: "#293264",
      backgroundColor: state.isSelected ? "lightgray" :"#F5F7FB",
      textAlign: "center"

    })
  }

    useEffect(()=> {
      const fetchData = async() => {
        console.log(quizOptions)
        let fetchString = `https://opentdb.com/api.php?amount=5`
        if(quizOptions[0]) {
          fetchString += `&category=${quizOptions[0]}`
        }
        if(quizOptions[1]) {
          fetchString += `&difficulty=${quizOptions[1]}`
        }
        console.log(fetchString)
        try {const res = await fetch(fetchString)
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
    if(!startMenu){
        fetchData()   
        console.log(quizOptions)
    }
  },[startNewGame, startMenu])

  function flipStartMenu() {
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
    
    <main className='relative overflow-hidden min-h-screen flex flex-col justify-around'>    
        <img className='absolute -top-30 -right-30 -z-1' src={yellowBlob} aria-hidden="true" alt=""/>
        <img className='absolute -bottom-20 -left-25 -z-1' src={blueBlob} aria-hidden="true" alt=""/>
     { startMenu ? <StartMenu flipStartMenu ={flipStartMenu}
     setQuizOptions={setQuizOptions}
     customStyles={customStyles}
     difficultyOptions={difficultyOptions}/> 
     :
     <>
      <section className='flex-grow flex flex-col items-center justify-around'>
        {questionElementsArr}
      </section>

      <section>
        <div className='flex gap-5 justify-center items-center mt-5 mb-3 sm:my-5 sm:gap-10 mx-3'>
        {answeredChecked && <p
          className='font-bold text-[#293264]'
        >You scored {countAnswers()}/5 correct answers</p>}
        <button
          className='w-40 bg-[#4D5B9E] rounded-lg h-[50px] text-[#F5F7FB] cursor-pointer'
          onClick={answeredChecked ? restartGame : handleCheckAnswers}>{answeredChecked ? 'Start new Game' : 'Check answers'}</button>
        </div>  
        {answeredChecked && <form className='flex justify-center mb-3 gap-2 px-1'>
          <Select options={categoriesData} onChange={(option => setQuizOptions(prev =>{
             const temp = [...prev]
             temp[0] = option.value
             return temp
             }))}
              menuPlacement="top"
              styles={customStyles}
              className='w-2/3 max-w-[400px]'/>
          <Select options={difficultyOptions} onChange={(option => setQuizOptions(prev =>{
            const temp = [...prev]
            temp[1] = option.value
            return temp
            }))}
             menuPlacement="top"
             styles={customStyles}
             className='w-1/3 max-w-[400px]'/>
          </form>}  
      </section>
      </>
      }
     </main>    
  );
}

export default App;
