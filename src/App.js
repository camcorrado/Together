import EditProfile from './components/EditProfile/EditProfile'
import Grid from './components/Grid/Grid'
import Hero from './components/Hero/Hero'
import Login from './components/Login/Login'
import Messenger from './components/Messenger/Messenger'
import React from 'react'
import { Route } from 'react-router-dom'
import SignUp from './components/SignUp/SignUp'
import UserProfile from './components/UserProfile/UserProfile'

class App extends React.Component  {
  render() {
    return (
      <main className='App'>
        <Route exact path='/Grid' component={Grid}/>
        <Route exact path='/' component={Hero}/>
        <Route exact path='/EditProfile' component={EditProfile}/>
        <Route exact path='/Login' component={Login}/>
        <Route exact path='/Messenger' component={Messenger}/>
        <Route exact path='/UserProfile' component={UserProfile}/>
        <Route exact path='/SignUp' component={SignUp}/>
      </main>
    )
  }
}

export default App;