import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/home'
import Login from './Pages/login'
import SignUp from './Pages/sign-up'
import Layout from './Layout'
import Transactions from './Pages/transactions'
import Alerts from './Pages/alerts'
import Budgets from './Pages/budgets'
import ImportCsv from './Pages/importcsv'
import Settings from './Pages/settings'
import Rapports from './Pages/rapports'


function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/signup' element = {<SignUp/>} /> 
        <Route path = '/login' element = {<Login/>} />
        <Route element = {<Layout/>}>
          <Route path = '/' element = {<Home/>} />
          <Route path = '/transactions' element = {<Transactions/>} />
          <Route path = '/importcsv' element = {<ImportCsv/>} />
          <Route path = '/budgets' element = {<Budgets/>} />
          <Route path = '/alerts' element = {<Alerts/>} />
          <Route path = '/rapports' element = {<Rapports/>} />
          <Route path = '/settings' element = {<Settings/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
