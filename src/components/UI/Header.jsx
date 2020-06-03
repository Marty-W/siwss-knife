import React, { useContext } from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import { GiSwissArmyKnife } from 'react-icons/gi'
import { AuthContext } from '../../context/authContext'
import { auth } from '../../utils/firebase'

import Button from './Button.styles'

const Header = () => {
  const { currentUser } = useContext(AuthContext)

  const signOutUser = () => {
    auth.signOut()
  }

  return (
    <Wrapper>
      <GiSwissArmyKnife />
      {currentUser ? (
        <LoginButton onClick={signOutUser}>Sign out</LoginButton>
      ) : (
        <Link to="/auth">
          <LoginButton>Sign in</LoginButton>
        </Link>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  grid-area: head;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5em;

  & svg {
    color: ${(props) => props.theme.colors.tertiary};
    width: 1.8em;
    font-size: 2rem;
  }

  svg:first-child {
    transform: rotate(-45deg);
    color: ${(props) => props.theme.colors.accent};
  }
`

const LoginButton = styled(Button)`
  border: 1px solid ${(props) => props.theme.colors.accent};
  padding: 0.5rem 1rem;
`

// TODO add hover style

export default Header
