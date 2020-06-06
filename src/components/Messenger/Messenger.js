import React from 'react'
import ValidationError from '../ValidationError'

class Messenger extends React.Component {

    state = {
        currentMessage: '',
        currentMessageTouched: false,
    }

    handleClickSend = (e) => {
        e.preventDefault()
    }

    onChangeMessage = async (value) => {
        await this.setState({currentMessageTouched: true})
        await this.setState({currentMessage: value})
    }

    validateMessage(value) {
        if (value.length > 0) {
            document.getElementById('sendButton').disabled = false
        } else if (value.length === 0) {
            document.getElementById('sendButton').disabled = true
        } else {
            return true
        }
    }

    render() {
        return (
            <section className='messenger'>
                <section>
                <p>Previous message history</p>
                </section>
                <section>
                <form className='messageForm'>
                    <div className='message'>
                        <textarea name='message' id='message' rows="15" required
                            onChange={e => this.onChangeMessage(e.target.value)}
                        ></textarea>
                        {this.state.currentMessageTouched && <ValidationError message={this.validateMessage(this.state.currentMessage)} />}
                    </div>
                    <div className='buttons'>
                        <button type="submit" id='sendButton' onClick={this.handleClickSend} disabled>Send</button>
                        <button onClick={() => this.props.history.push('/UserProfile')}>Back</button>
                    </div>
                </form>
                </section>
            </section>
        )
    }
}

export default Messenger
