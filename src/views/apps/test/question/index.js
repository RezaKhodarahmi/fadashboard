import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { newQuestion, deleteQuestion, updateQuestion } from 'src/store/apps/question'
import { newAnswersReq, updateAnswers } from 'src/store/apps/answer'
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash'

const Questions = props => {
  const dispatch = useDispatch()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState([])
  const [submitQuestion, setSubmitQuestion] = useState(false)
  const [isApiLoaded, setIsApiLoaded] = useState(true)
  const { register: register2, handleSubmit: handleSubmit2, errors: errors2 } = useForm()
  const existQuestion = useSelector(state => state.question)

  // Set initial questions and answers from props
  useEffect(() => {
    if (Array.isArray(props?.Questions)) {
      setQuestions(props?.Questions)
      setAnswers(props?.Questions.map(question => question.answers || []))
    }
  }, [props.Questions])

  // Create a new question
  const handleCreateQuestion = () => {
    const newQuestions = [...questions]
    const secId = newQuestions[newQuestions.length - 1]?.secId || '0'
    newQuestions.push({
      secId: parseInt(secId) + 1,
      testId: props.testId,
      questionText: `Question ${parseInt(secId) + 1}`,
      questionType: '0',
      explanation: '',
      image: ''
    })
    setQuestions(newQuestions)
    setSubmitQuestion(true)
    handleAnswers({ target: { value: '0' } }, newQuestions.length - 1)
  }

  // Update question with the existing question data
  useEffect(() => {
    if (existQuestion?.data?.data) {
      const newQuestions = [...questions]
      const existQuIndex = newQuestions.findIndex(question => question.secId == existQuestion?.data?.data[0].secId)

      if (existQuIndex !== -1) {
        const updatedQuestion = {
          ...newQuestions[existQuIndex],
          id: existQuestion?.data?.data[0].id
        }
        newQuestions.splice(existQuIndex, 1, updatedQuestion)
        setQuestions(newQuestions)
      }
    }
  }, [existQuestion])

  // Dispatch new question action
  useEffect(() => {
    if (questions && submitQuestion) {
      dispatch(newQuestion(questions))
      setSubmitQuestion(false)
    }
  }, [questions, submitQuestion])

  // Delete a question
  const handleDeleteQuestion = id => {
    const arrayQuestions = [...questions]
    const confirmation = window.confirm('Are you sure you want to delete the question?')
    if (confirmation) {
      dispatch(deleteQuestion(id))
      const newQuestions = arrayQuestions.filter(question => question.secId !== id.secId)
      setQuestions(newQuestions)
    }
  }

  // Dummy submit function
  const onSubmit2 = data => {}

  // Update question answers
  const handleAnswers = (e, index, questionId) => {
    const newAnswers = [...answers]
    const options = parseInt(e.target?.value || e)

    const questionAnswers = Array.from({ length: options }, (value, i) => ({
      answerId: i,
      questionId: questionId,
      answerText: `Option ${i + 1}`,
      isCorrect: i === 0
    }))

    newAnswers[index] = questionAnswers
    dispatch(newAnswersReq(newAnswers[index]))
    setAnswers(newAnswers)
  }

  // Handle updates to questions and answers
  const handleQuestionUpdate = useCallback(
    _.debounce((field, value, questionIndex, answerIndex = null, questionId) => {
      const newQuestions = [...questions]
      const newAnswers = [...answers]

      const updatedQuestion = { ...newQuestions[questionIndex] }

      if (field === 'questionText') {
        updatedQuestion.questionText = value
      } else if (field === 'explanation') {
        updatedQuestion.explanation = value
      } else if (field === 'questionType') {
        updatedQuestion.questionType = value.target.value
      } else if (field === 'image') {
        updatedQuestion.image = value
      }

      newQuestions[questionIndex] = updatedQuestion

      if (field === 'answerText') {
        newAnswers[questionIndex] = newAnswers[questionIndex].map((ans, idx) => {
          if (idx === answerIndex) {
            return { ...ans, answerText: value }
          }

          return ans
        })
      } else if (field === 'isCorrect') {
        newAnswers[questionIndex] = newAnswers[questionIndex].map((answer, index) => {
          if (index === answerIndex) {
            return { ...answer, isCorrect: value }
          }

          return answer
        })
      }

      if (field === 'questionText' || field === 'explanation' || field === 'questionType' || field === 'image') {
        dispatch(updateQuestion(newQuestions))
      }
      if (field === 'answerText' || field === 'isCorrect') {
        dispatch(updateAnswers(newAnswers))
      }

      setQuestions(newQuestions)
      setAnswers(newAnswers)
    }, 1500),
    [questions, answers]
  )

  return (
    <>
      <Grid marginTop={5} item xs={12} sm={12} flex>
        <div>
          {isApiLoaded &&
            Array.isArray(questions) &&
            questions.map((question, index) => (
              <form
                key={question.id}
                style={{ background: '#fff', marginBottom: '1rem', borderRadius: '15px', padding: '10px 10px' }}
                onSubmit={handleSubmit2(onSubmit2)}
              >
                <TextField
                  {...register2(`questions.${index}.secId`)}
                  defaultValue={question.secId}
                  label='id'
                  type='hidden'
                  InputLabelProps={{
                    shrink: true
                  }}
                  style={{ display: 'none' }}
                />

                <Grid key={question.secId} container spacing={2}>
                  <Grid marginTop={5} item xs={12} sm={6}>
                    <TextField
                      {...register2(`questions.${index}.newQuestion`)}
                      defaultValue={question.questionText}
                      label='Question'
                      fullWidth
                      onChange={e => handleQuestionUpdate('questionText', e.target.value, index)}
                    />
                  </Grid>
                  <Grid marginTop={5} item xs={12} sm={6}>
                    <TextField
                      {...register2(`questions.${index}.image`)}
                      defaultValue={question.image}
                      label='Image URL'
                      type='url'
                      fullWidth
                      onChange={e => handleQuestionUpdate('image', e.target.value, index)}
                    />
                  </Grid>
                  <Grid marginTop={5} item xs={12} sm={5}>
                    <FormControl fullWidth>
                      <InputLabel id='vipAccess-select-label'>Question Type</InputLabel>
                      <Select
                        {...register2(`questions.${index}.questionType`)}
                        defaultValue={question.questionType}
                        labelId='questionType-select-label'
                        label='Question Type'
                        onChange={e => handleAnswers(e, index, question.id)}
                      >
                        <MenuItem value={'6'}>6 options</MenuItem>
                        <MenuItem value={'5'}>5 options</MenuItem>
                        <MenuItem value={'4'}>4 options</MenuItem>
                        <MenuItem value={'3'}>3 options</MenuItem>
                        <MenuItem value={'2'}>2 options</MenuItem>
                        <MenuItem value={'1'}>1 option</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid container justify='center' alignItems='center' marginTop={5} item xs={12} sm={1}>
                    <Button
                      type='button'
                      size='small'
                      variant='contained'
                      color='primary'
                      onClick={() => handleDeleteQuestion({ id: question.testId, secId: question.secId })}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>

                <Grid container marginTop={5} spacing={2}>
                  {Array.isArray(answers[index]) &&
                    answers[index]?.map((answer, answerIndex) => (
                      <Grid item xs={12} sm={12} key={`answer-${answerIndex}`}>
                        <TextField
                          {...register2(`questions.${index}.answers.${answerIndex}.answerText`)}
                          defaultValue={answer.answerText}
                          label={`Answer ${answerIndex + 1}`}
                          fullWidth
                          onChange={e =>
                            handleQuestionUpdate('answerText', e.target.value, index, answerIndex, question.id)
                          }
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register2(`questions.${index}.answers.${answerIndex}.isCorrect`)}
                              defaultChecked={answer.isCorrect}
                              color='primary'
                              onChange={e => handleQuestionUpdate('isCorrect', e.target.checked, index, answerIndex)}
                            />
                          }
                          label='Correct'
                        />
                      </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} sm={12} marginTop={2}>
                  <TextField
                    {...register2(`questions.${index}.explanation`)}
                    label='Explanation for the correct answer'
                    multiline
                    defaultValue={question.explanation}
                    rows={4}
                    fullWidth
                    variant='outlined'
                    onChange={e => handleQuestionUpdate('explanation', e.target.value, index)}
                  />
                </Grid>
              </form>
            ))}
          <Grid container justify='center' alignItems='center' marginTop={5} item xs={12} sm={1}>
            <Button type='button' size='small' variant='contained' color='primary' onClick={handleCreateQuestion}>
              New Question
            </Button>
          </Grid>
        </div>
      </Grid>
    </>
  )
}

export default Questions
