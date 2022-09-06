import { ChatContainer, ConversationContainer } from '@xkit-yx/im-kit-ui';

import './index.less';

const Chat: React.FC = () => {
  return (
    <div className="chat-container">
      <div className="conversation-list">
        <ConversationContainer />
      </div>
      <div className="chat-list">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Chat;
