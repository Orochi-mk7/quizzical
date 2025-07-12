import he from 'he'
import clsx from 'clsx'
export default function QuestionEntry(props) {

    function handleSelectedStyle(el) {
         return props.selected[props.index] === el;
    }
    function checkIfCorrect(el) {
        return props.correctAnswers[props.index] === el;
    }
    const answerElArray = props.answersArray.map((el)=>{
        return <button onClick={(e)=>{
            e.preventDefault()
             props.handleAnswerSelection(el, props.index)} 
            } key={el} 
            disabled = {props.answeredChecked ? true : false}
            className={clsx('text-[#293264]', 'text-sm', 'border', 'border-[#4D5B9E]',
                'rounded-lg', 'font-medium', 'cursor-pointer', 'whitespace-nowrap',
                'px-2','sm:text-base',
                //selected only
                handleSelectedStyle(el) && !props.answeredChecked ? 'bg-[#D6DBF5]' : undefined,
                //not selected and answered are revelied
                !handleSelectedStyle(el) && props.answeredChecked && 'disabled: disabled:text-gray-500 disabled:cursor-not-allowed border-[#4D5B9E]',
                //answers reveled, selected and not correct
                props.answeredChecked && handleSelectedStyle(el) && !checkIfCorrect(el) && 'bg-[#F8BCBC] disabled: disabled:text-gray-500 disabled:cursor-not-allowed',
                //answers reveled, selected and correct
                props.answeredChecked && checkIfCorrect(el) && 'bg-[#94D7A2] disabled:cursor-not-allowed'
                )}>
            {he.decode(el)}</button>
    })

    return (
            <form className='w-[90%] border-b py-5 border-b-[#DBDEF0] sm:py-7'>
                <p className='text-indigo-900 font-bold mb-3 sm:text-lg'>{he.decode(props.questionText)}</p>
                <div className='flex gap-3 flex-wrap '>
                    {answerElArray}
                </div>
          </form>
    )
}//'bg-[#F8BCBC]'