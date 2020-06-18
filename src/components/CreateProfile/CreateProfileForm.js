import ApiContext from '../../ApiContext'
import config from '../../config'
import React, { Component } from 'react'
import TokenService from '../../services/token-service'

export default class CreateProfileForm extends Component {
    static contextType = ApiContext

    static defaultProps = {
        user: [],
        onCreateSuccess: () => {}
    }

    state = {
        error: null,
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { username, bio, profile_pic, interests, pronouns, zipcode } = e.target
        const newProfile = { 
            username: username.value, 
            bio: bio.value, 
            profile_pic: profile_pic.value, 
            interests: interests.value, 
            pronouns: pronouns.value, 
            zipcode: zipcode.value
        }
        console.log({newProfile})
        this.setState({ error: null })

        fetch(`${config.API_ENDPOINT}/profiles`, 
            {
                method: 'POST',
                body: JSON.stringify(newProfile),
                headers: {
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'authorization': `bearer ${TokenService.getAuthToken()}`,
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
            })
            .then(this.props.onCreateSuccess())
            .catch(res => {
                this.setState({ error: res.error })
            })
    }

    render() {
        const { error } = this.state
        return (
            <form 
                className='CreateProfileForm'
                onSubmit={this.handleSubmit}
            >
                <div role='alert'>
                    {error && <p className='red'>{error}</p>}
                </div>
                <div className='usernameInput'>
                    <label htmlFor='username'>Username</label>
                    <input type='text' name='username' id='username' required />
                </div>
                <div className='profilePicInput'>
                    <label htmlFor='profile_pic'>Profile Picture</label>
                    <input type='text' name='profile_pic' id='profile_pic' required />
                </div>
                <div className='bioInput'>
                    <label htmlFor='bio'>About</label>
                    <textarea name='bio' id='bio' rows='15'></textarea>
                </div>
                <div className='interestsInput'>
                    <label htmlFor='interests'>Interests</label>
                    <div className='interestCheckboxes'>
                        <label htmlFor='activism'>Activism</label>
                        <input type='checkbox' name='interests' id='interests' value='activism' className='interest-checkbox' />
                        <label htmlFor='drag'>Drag</label>
                        <input type='checkbox' name='interests' id='interests' value='drag' className='interest-checkbox' />
                        <label htmlFor='gaming'>Gaming</label>
                        <input type='checkbox' name='interests' id='interests' value='gaming' className='interest-checkbox' />
                        <label htmlFor='reading'>Reading</label>
                        <input type='checkbox' name='interests' id='interests' value='reading' className='interest-checkbox' />
                        <label htmlFor='nightlife'>Nightlife</label>
                        <input type='checkbox' name='interests' id='interests' value='nightlife' className='interest-checkbox' />
                    </div>
                </div>
                <div className='pronounsInput'>
                    <label htmlFor='pronouns'>Pronouns</label>
                    <select name="pronouns" id="pronouns" required>
                        <option value="She/Her">She/Her</option>
                        <option value="He/Him">He/Him</option>
                        <option value="They/Them">They/Them</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className='zipcodeInput'>
                    <label htmlFor='zipcode'>Zipcode</label>
                    <input type='number' name='zipcode' id='zipcode' maxLength='5' required />
                </div>
                <div className='buttons'>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        )
    }
}