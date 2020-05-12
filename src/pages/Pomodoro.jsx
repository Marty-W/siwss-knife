import React, { useContext } from 'react'
import styled from 'styled-components/macro'

import TimePicker from '../components/pomodoro/TimePicker'
import Button from '../components/UI/Button'
import FocusMode from '../components/pomodoro/FocusMode'
import TimeEntries from '../components/pomodoro/TimeEntries'

import { PomoContext } from '../context/pomoContext'

const Pomodoro = () => {
  const [state, dispatch] = useContext(PomoContext)
  const { isModalOpen } = state

  const handlePomoStart = () => {
    dispatch({ type: 'POMO_START' })
  }

  return (
    <>
      {isModalOpen && <FocusMode />}
      <PomoWrapper>
        <h1>Pomodoro</h1>
        <TimePicker />
        <Button onClick={handlePomoStart}>Start</Button>
        <TimeEntries />
      </PomoWrapper>
    </>
  )
}

const PomoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  height: 100%;
  width: 100%;
`

export default Pomodoro
