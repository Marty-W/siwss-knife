/* eslint-disable consistent-return */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components/'
import { DateTime } from 'luxon'
import { CircularProgress } from '@material-ui/core'

import Card from '../UI/Card.styles'
import DailyGoalGetter from './DailyGoalGetter'
import DailyGoalSetter from './DailyGoalSetter'

import { db } from '../../firebase/firebase'
import useCurrentUser from '~/hooks/useCurrentUser'

const DailyGoal: React.FC = () => {
  const [isGoalSet, setIsGoalSet] = useState(true)
  const [dailyGoal, setDailyGoal] = useState(0)
  const [completed, setCompleted] = useState(0)
  const [isLoading, setIsLoading] = useState<boolean>()
  const user = useCurrentUser()

  const statsRef = db.doc(`users/${user?.uid}/pomoStats/stats`)

  useEffect(() => {
    if (user) {
      setIsLoading(true)
      const unsubscribe = statsRef.onSnapshot((doc) => {
        const data = doc?.data()
        const dtServer = DateTime.fromMillis(data?.timestamp).day
        const dtNow = DateTime.local().day

        if (dtServer === dtNow) {
          setDailyGoal(data?.dailyGoal)
          setCompleted(data?.completed)
        } else {
          setCompleted(0)
          resetGoal()
          setIsGoalSet(false)
        }
      })
      setIsLoading(false)
      return () => unsubscribe()
    }
  }, [user])

  const resetGoal = async () => {
    try {
      await statsRef.update({
        completed: 0,
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Wrapper>
      {isLoading ? ( //FIXME center svg
        <CircularProgress />
      ) : (
        <>
          {isGoalSet && dailyGoal ? (
            <DailyGoalGetter
              dailyGoal={dailyGoal}
              completed={completed}
              handleGoal={setIsGoalSet}
            />
          ) : (
            <DailyGoalSetter handleGoal={setIsGoalSet} />
          )}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled(Card)`
  grid-area: goal;
  & svg {
    margin: auto;
  }
`

export default DailyGoal
