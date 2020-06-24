import ApiContext from '../../ApiContext'
import config from '../../config'
import EditProfileForm from './EditProfileForm'
import React, { Component } from 'react'

export default class EditProfilepage extends Component {
    static contextType = ApiContext

    static defaultProps = {
        userProfile: [],
        history: {
            push: () => {},
        },
        editProfile: () => {},
    }

    state = {
        id: null,
        user_id: null,
        username: null,
        bio: null,
        profile_pic: null,
        interests: null,
        pronouns: null,
        zipcode: null,
    }

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/profiles/${this.context.userProfile.id}`, {
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
            .then(data => {
                this.setState({
                    id: data.id,
                    user_id: data.user_id,
                    username: data.username,
                    bio: data.bio,
                    profile_pic: data.profile_pic,
                    interests: data.interests,
                    pronouns: data.pronouns,
                    zipcode: data.zipcode,
                })
                console.log(this.state)
            })
            .catch(error => {
                console.error(error)
            })
    }

    handleChangeUsername = value => {
        this.setState({
            username: value
        })
    }

    handleChangeBio = value => {
        this.setState({
            bio: value
        })
    }

    handleChangeZipcode = value => {
        this.setState({
            zipcode: value
        })
    }

    handleEditSuccess = () => {
        this.props.history.push('/UserProfile')
    }

    render() {
        const { username, bio, profile_pic, interests, pronouns, zipcode } = this.state
        const profile = { username, bio, profile_pic, interests, pronouns, zipcode }
        return (
            <section className='EditProfilePage'>
                <header>
                    <h1>Edit Your Profile</h1>
                </header>
                <EditProfileForm
                    profile={profile} 
                    onEditSuccess={this.handleEditSuccess}
                    onUsernameChange={this.handleChangeUsername}
                    onBioChange={this.handleChangeBio}
                    onZipcodeChange={this.handleChangeZipcode}
                />
            </section>
        )
    }
}