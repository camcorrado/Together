import ApiContext from '../../ApiContext'
import Checkbox from '../Checkbox/Checkbox'
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
        items: [
            'Activism', 
            'Drag',
            'Gaming',
            'Reading',
            'Nightlife',
        ]
    }

    componentDidMount = () => {
        this.selectedCheckboxes = new Set();
    }

    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }
    }

    createCheckbox = label => (
        <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
        />
    )

    createCheckboxes = () => (
        this.state.items.map(this.createCheckbox)
    )

    handleSubmit = (e) => {
        e.preventDefault()
        const interests = []
        const { username, bio, profile_pic, pronouns, zipcode } = e.target
        for (const checkbox of this.selectedCheckboxes) {
            interests.push(checkbox)
          }
        const newProfile = { 
            username: username.value, 
            bio: bio.value, 
            profile_pic: profile_pic.value, 
            interests: interests, 
            pronouns: pronouns.value, 
            zipcode: zipcode.value
        }
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
                        {this.createCheckboxes()}
                    </div>
                </div>
                <div className='pronounsInput'>
                    <label htmlFor='pronouns'>Pronouns</label>
                    <select name="pronouns" id="pronouns" required>
                        <option value="She/Her">She/Her</option>
                        <option value="He/Him">He/Him</option>
                        <option value="They/Them">They/Them</option>
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