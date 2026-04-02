import { useState, useCallback } from 'react'
import type { AnswerRecord, Question } from './types/question'
import type { Team } from './types/team'
import type { ResultData } from './types/engine'
import { TEAMS } from './data/teams'
import { QUESTIONS } from './data/questions'
import {
  handleAnswer as engineHandleAnswer,
  replayFilters,
  PATHWAY_FIRST_Q,
} from './engine/selectorEngine'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { PathwayScreen, QuestionScreen } from './pages/Selector'
import { ResultScreen } from './pages/Result'

type Screen = 'landing' | 'pathway' | 'question' | 'result'

type ExtendedResult = ResultData & { runnerUpDiff?: string | null }

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [pathway, setPathway] = useState<string | null>(null)
  const [remaining, setRemaining] = useState<Team[]>([...TEAMS])
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [askedIds, setAskedIds] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [result, setResult] = useState<ExtendedResult | null>(null)
  const [relaxedMessage, setRelaxedMessage] = useState<string | null>(null)
  const [pivotMessage, setPivotMessage] = useState<string | null>(null)

  const doRestart = useCallback(() => {
    setScreen('landing')
    setPathway(null)
    setRemaining([...TEAMS])
    setAnswers([])
    setAskedIds([])
    setCurrentQuestion(null)
    setResult(null)
    setRelaxedMessage(null)
    setPivotMessage(null)
  }, [])

  const handlePathwaySelect = useCallback((p: string) => {
    const firstQId = PATHWAY_FIRST_Q[p]
    const q = QUESTIONS.find(q => q.id === firstQId) ?? null
    setPathway(p)
    setCurrentQuestion(q)
    setRemaining([...TEAMS])
    setAnswers([])
    setAskedIds([])
    setRelaxedMessage(null)
    setPivotMessage(null)
    setScreen('question')
  }, [])

  const handleAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion || !pathway) return

      const engineResult = engineHandleAnswer(
        currentQuestion,
        value,
        remaining,
        answers,
        askedIds,
        pathway
      )

      const {
        newRemaining,
        newAnswers,
        newAskedIds,
        relaxedMessage: rm,
        result: res,
        nextQuestion,
        pivotMessage: pm,
      } = engineResult

      setRemaining(newRemaining)
      setAnswers(newAnswers)
      setAskedIds(newAskedIds)

      if (rm) setRelaxedMessage(rm)

      if (res) {
        setResult(res as ExtendedResult)
        setScreen('result')
        return
      }

      setPivotMessage(pm)
      setCurrentQuestion(nextQuestion)
    },
    [currentQuestion, pathway, remaining, answers, askedIds]
  )

  const handleBack = useCallback(() => {
    if (answers.length === 0) {
      // Back to pathway chooser
      setScreen('pathway')
      setCurrentQuestion(null)
      setRelaxedMessage(null)
      setPivotMessage(null)
      return
    }

    // Undo last answer
    const lastQId = askedIds[askedIds.length - 1]
    const newAnswers = answers.slice(0, -1)
    const newAskedIds = askedIds.slice(0, -1)
    const newRemaining = replayFilters(newAnswers)

    setAnswers(newAnswers)
    setAskedIds(newAskedIds)
    setRemaining(newRemaining)
    setCurrentQuestion(QUESTIONS.find(q => q.id === lastQId) ?? null)
    setRelaxedMessage(null)
    setPivotMessage(null)
  }, [answers, askedIds])

  return (
    <Layout>
      <div className="min-h-full flex flex-col">
        {screen === 'landing' && (
          <div className="flex-1">
            <Home onStart={() => setScreen('pathway')} />
          </div>
        )}

        {screen === 'pathway' && (
          <div className="flex-1 overflow-y-auto">
            <PathwayScreen onSelect={handlePathwaySelect} />
          </div>
        )}

        {screen === 'question' && currentQuestion && (
          <div className="flex-1 overflow-y-auto">
            <QuestionScreen
              question={currentQuestion}
              remaining={remaining}
              answers={answers}
              pathway={pathway ?? 'colours'}
              pivotMessage={pivotMessage}
              onAnswer={handleAnswer}
              onBack={handleBack}
              onRestart={doRestart}
            />
          </div>
        )}

        {screen === 'result' && result && (
          <div className="flex-1 overflow-y-auto">
            <ResultScreen
              result={result}
              relaxedMessage={relaxedMessage}
              onRestart={doRestart}
              onChangePathway={() => {
                setScreen('pathway')
                setRemaining([...TEAMS])
                setAnswers([])
                setAskedIds([])
                setCurrentQuestion(null)
                setResult(null)
                setRelaxedMessage(null)
                setPivotMessage(null)
              }}
            />
          </div>
        )}
      </div>
    </Layout>
  )
}
