import React from 'react';
import './Chat.css';
export default class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.myNick = this.props.myNick;
    }
    componentDidMount() {

    }
    render() {
        let messages = this.props.messages;
        console.log(messages);
        let messagesView = [];
        for (let i = 0; i < messages.length; i++) {
            if (messages[i].sender === this.myNick) { messagesView.push(<div className="sender">{messages[i].text}</div>) }
            else {
                messagesView.push(<div className='recipient'>{messages[i].text}</div>)
            }
        }
        return (
            <div className="chatwindow">
                {messagesView}
                <input type="text" id='text' className="text" />
                <button className="sendButton" onClick={this.props.onSendButton}>Send</button>
            </div>
        )
    }

}