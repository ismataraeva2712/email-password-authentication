
import './App.css';
import app from './firebbase.init';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import Form from 'react-bootstrap/Form'
import { Button } from 'react-bootstrap';
import { useState } from 'react';
const auth = getAuth(app);

function App() {
  const [validated, setValidated] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, seterror] = useState('')
  // ----------------------------------------------
  const handleNameBlur = event => {
    setEmail(event.target.value)
  }
  const handleEmailBlur = event => {
    setEmail(event.target.value)
  }
  const handlePassBlur = event => {
    setPassword(event.target.value)
  }
  const handleRegistered = event => {
    setRegistered(event.target.checked)
    console.log(event.target.checked)
  }
  // ----------------------------------------
  const handleSubmit = event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return
    }

    setValidated(true);
    if (!/[ $@#&! ]/.test(password)) {
      seterror('password should contain one special character')
      return;
    }
    seterror('')
    // -----------------------------------------------
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          console.log(user)
        })
        .catch(error => {
          seterror(error.message)
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          console.log(user)
          setEmail('')
          setPassword('')
          verifyEmail()
          setUserName()
        })
        .catch(error => {
          console.error(error)
          seterror(error.message)
        })
    }

    event.preventDefault()

  }
  // -------------------------------------
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email varified')
      })
  }
  // ----------------------------------------------
  const handleResetPasword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('email send')
      })
  }
  // ------------------------------------
  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {
        console.log('update name')
      })
      .catch((error) => {
        seterror(error.message)
      })
  }
  return (
    <div className="">
      <div className='w-50 mx-auto mt-3'>
        <h2>please {registered ? 'login' : 'register'}</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />

            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Form.Group>}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control onBlur={handlePassBlur} type="password" placeholder="Password" required />
            <Form.Control.Feedback type="invalid">
              Please provide a valid password.
            </Form.Control.Feedback>
            <p className='text-danger'>{error}</p>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check onChange={handleRegistered} type="checkbox" label="Allready registered" />
          </Form.Group>
          <Button variant="primary" type="submit">
            {registered ? 'login' : 'register'}
          </Button> <br />
          <Button onClick={handleResetPasword} variant="link" >
            Forget password?
          </Button>
        </Form>
      </div>





    </div>
  );
}

export default App;
