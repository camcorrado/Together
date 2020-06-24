import ApiContext from './ApiContext'
import config from './config'
import CreateProfilePage from './components/CreateProfile/CreateProfilePage'
import EditProfilePage from './components/EditProfile/EditProfilePage'
import Grid from './components/Grid/Grid'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import LoginPage from './components/Login/LoginPage'
import Messenger from './components/Messenger/Messenger'
import NotFoundPage from './components/NotFoundPage/NotFoundPage'
import PublicOnlyRoute from './components/Utils/PublicOnlyRoute'
import PrivateRoute from './components/Utils/PrivateRoute'
import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import SignUpPage from './components/SignUp/SignUpPage'
import UserProfile from './components/UserProfile/UserProfile'

class App extends Component  {
    state = {
        userInfo: [],
        userProfile: [],
        nearbyProfiles: [],
        hasError: false,
    }

    static getDerivedStateFromError(error) {
        console.error(error)
        return { hasError: true }
    }

    handleSetUserInfo = (data) => {
        this.setState({
            userInfo: data
        })
    }

    handleSetProfileInfo = async (id) => {
        await fetch(`${config.API_ENDPOINT}/profiles`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
                return res.json()
            })
            .then((data) => {
                console.log(data)
                const profileInfo = data.filter(profile => profile.user_id === id)
                this.setState({
                    userProfile: profileInfo[0]
                })
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleEditProfile = (data) => {
        this.setState({
            userProfile: data
        })
    }

    render() {
        const value = {
            userInfo: this.state.userInfo,
            userProfile: this.state.userProfile,
            nearbyProfiles: this.state.nearbyProfiles,
            setUserInfo: this.handleSetUserInfo,
            setProfileInfo: this.handleSetProfileInfo,
            editProfile: this.handleEditProfile,
        }
        return (
            <ApiContext.Provider value={value}>
                <main className='App'>
                    <header className='App_Header'>
                        <Header />
                    </header>
                    {this.state.hasError && <p className='red'>There was an error! Oh no!</p>}
                    <Switch>
                        <Route
                            exact
                            path={'/'}
                            component={Hero}
                        />
                        <PublicOnlyRoute
                            path={'/login'}
                            component={LoginPage}
                        />
                        <PublicOnlyRoute
                            path={'/signup'}
                            component={SignUpPage}
                        />
                        <PrivateRoute
                            path={'/createprofile'}
                            component={CreateProfilePage}
                        />
                        <PrivateRoute
                            path={'/editprofile'}
                            component={EditProfilePage}
                        />
                        <PrivateRoute
                            path={'/grid'}
                            component={Grid}
                        />
                        <PrivateRoute
                            path={'/messenger'}
                            component={Messenger}
                        />
                        <PrivateRoute
                            path={'/userprofile'}
                            component={UserProfile}
                        />
                        <Route
                            component={NotFoundPage}
                        />
                    </Switch>
                </main>
            </ApiContext.Provider>
        )
    }
}

export default App