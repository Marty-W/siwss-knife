import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components/macro'
import { Duration } from 'luxon'

import { useInterval } from '../../hooks/useInterval'
import { PomoContext } from '../../context/pomoContext'
import { AuthContext } from '../../context/authContext'
import { db, firebase } from '../../utils/firebase'

import TimerEstimate from './TimerEstimate'

const Ticker = () => {
  const [startTime] = useState(() => Date.now())
  const [localSessionLength, setLocalSessionLength] = useState(() =>
    Duration.fromMillis(0)
  )
  const { currentUser } = useContext(AuthContext)
  const [state, dispatch] = useContext(PomoContext)
  const { duration, isRunning, isPaused, isBreak } = state

  useEffect(() => {
    setLocalSessionLength(duration)
  }, [duration])

  useInterval(() => {
    if (isRunning && !isPaused) {
      setLocalSessionLength((prev) => {
        if (prev.as('milliseconds') > 0) {
          return prev.minus(1000)
        }
        return prev
      })
    }
    if (localSessionLength.as('milliseconds') === 0) {
      if (!isBreak) {
        pushTimeEntries()
        addToTimeGoal()
        dispatch({ type: 'POMO_FINISH' })
      } else if (isBreak) {
        dispatch({ type: 'POMO_ABORT' })
      }
    }
  }, 10)

  const createTimeEntries = () => ({
    startTime,
    endTime: Date.now(),
    durationInMinutes: duration.as('minutes'),
  })

  const pushTimeEntries = async () => {
    const { uid } = currentUser
    try {
      const entriesRef = db.doc(`users/${uid}/pomo/timeEntries`)
      await entriesRef.update({
        timeEntries: firebase.firestore.FieldValue.arrayUnion(
          createTimeEntries()
        ),
      })
    } catch (err) {
      console.log(err)
    }
  }

  const addToTimeGoal = async () => {
    try {
      await db.doc(`users/${currentUser.uid}/pomo/stats`).update({
        completed: firebase.firestore.FieldValue.increment(
          duration.as('minutes')
        ),
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <StyledTicker>{localSessionLength.toFormat('mm:ss')}</StyledTicker>
      <TimerEstimate localSesh={localSessionLength} />
    </>
  )
}

export default Ticker

const StyledTicker = styled.span`
  color: ${(props) => props.theme.colors.white};
  font-size: 2.3rem;
  margin: 1em;
`
