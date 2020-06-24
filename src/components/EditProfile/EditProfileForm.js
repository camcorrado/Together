import ApiContext from '../../ApiContext'
import Checkbox from '../Checkbox/Checkbox'
import config from '../../config'
import React, { Component } from 'react'

export default class EditProfileForm extends Component {
    static contextType = ApiContext

    static defaultProps = {
        onEditSuccess: () => {}
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

    createCheckboxes = () => {
        this.state.items.map(this.createCheckbox)
    }

    onUsernameChange = async (e) => {
        await this.props.onUsernameChange(e.target.value)
    }

    onBioChange = async (e) => {
        await this.props.onBioChange(e.target.value)
    }

    onZipcodeChange = async (e) => {
        await this.props.onZipcodeChange(e.target.value)
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
        const { username, bio, profile_pic, interests, pronouns, zipcode } = this.props.profile
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
                    <input type='text' name='username' id='username' placeholder={username || ''} value={username || ''} onChange={this.onUsernameChange} aria-required='true' required />
                </div>
                <div className='bioInput'>
                    <label htmlFor='bio'>About</label>
                    <textarea name='bio' id='bio' rows='15' placeholder={bio || ''} value={bio || ''} onChange={this.onBioChange} aria-required='true'></textarea>
                </div>
                <div className='interestsInput'>
                    <label htmlFor='interests'>Interests</label>
                    <div className='interestCheckboxes'>
                        {this.createCheckboxes()}
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
                    <input type='number' name='zipcode' id='zipcode' maxLength='5' placeholder={zipcode || ''} value={zipcode || ''} onChange={this.onZipcodeChange} aria-required='true'required />
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