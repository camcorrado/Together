import ApiContext from '../../ApiContext'
import config from '../../config'
import React, { Component } from 'react'

export default class EditProfileForm extends Component {
    static contextType = ApiContext

    static defaultProps = {
        user: [],
        onEditSuccess: () => {}
    }

    state = {
        profile: {
            username: '',
            bio: '',
            profile_pic: '',
            interests: '',
            pronouns: '',
            zipcode: '',
        },
        error: null,
    }

    componentDidMount() {
        if (this.props.profileId) {
            const profileId = this.props.profileId
            fetch(`${config.API_ENDPOINT}/api/profiles/${profileId}`, {
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
                .then(data => this.setEditProfile(data))
                .catch(error => {
                    console.error(error)
                })
        }
    }

    setEditProfile = (profileData) => {
        this.setState({
            profile: profileData
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { username, bio, profile_pic, interests, pronouns, zipcode } = e.target
        const newProfile = { username, bio, profile_pic, interests, pronouns, zipcode }
        const profileId = this.props.profileId
        this.setState({ error: null })

        fetch(`${config.API_ENDPOINT}/api/EditProfile/${profileId}`, 
            {
                method: 'PATCH',
                body: JSON.stringify(newProfile),
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
            })
            .then(this.props.onEditSuccess())
            .catch(res => {
                this.setState({ error: res.error })
            })
    }

    render() {
        const { error } = this.state
        return (
            <form 
                className='EditProfileForm'
                onSubmit={this.handleSubmit}
            >
                <div role='alert'>
                    {error && <p className='red'>{error}</p>}
                </div>
                <div className='usernameInput'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' name='username' id='username' required />
                </div>
                <div className='bioInput'>
                    <label htmlFor='bio'>About</label>
                    <textarea name='bio' id='bio' rows='15'></textarea>
                </div>
                <div className='interestsInput'>
                    <label htmlFor='interests'>Interests</label>
                    <div className='interestCheckboxes'>
                        <input type='checkbox' name='interest' value='0' className='interest-checkbox' />
                        <label htmlFor='interest'>Activism</label>
                        <input type='checkbox' name='interest' value='1' className='interest-checkbox' />
                        <label htmlFor='interest'>Drag / Performance Art</label>
                        <input type='checkbox' name='interest' value='2' className='interest-checkbox' />
                        <label htmlFor='interest'>Gaming</label>
                        <input type='checkbox' name='interest' value='3' className='interest-checkbox' />
                        <label htmlFor='interest'>Reading</label>
                        <input type='checkbox' name='interest' value='4' className='interest-checkbox' />
                        <label htmlFor='interest'>Nightlife</label>
                    </div>
                </div>
                <div className='pronounsInput'>
                    <label htmlFor='pronouns'>Pronouns</label>
                    <input type="text" list="pronouns" />
                    <datalist name="pronouns" id="pronouns" required>
                        <option value="She/Her">She/Her</option>
                        <option value="He/Him">He/Him</option>
                        <option value="They/Them">They/Them</option>
                        <option value="Other">Other</option>
                    </datalist>
                </div>
                <div className='zipcodeInput'>
                    <label htmlFor='zipcode'>Zipcode</label>
                    <input type='number' name='zipcode' id='zipcode' maxLength='5' required />
                </div>
                <div className='buttons'>
                    <button 
                        type='submit'
                        onClick={this.handleSubmit}>Submit
                    </button>
                    <button onClick={() => this.props.history.push('/UserProfile')}>Cancel</button>
                </div>
            </form>
        )
    }
}