import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/home'
import Login from './Pages/login'
import SignUp from './Pages/sign-up'
import Layout from './Layout'


function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/signup' element = {<SignUp/>} /> 
        <Route path = '/login' element = {<Login/>} />
        <Route element = {<Layout/>}>
          <Route path = '/' element = {<Home/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
