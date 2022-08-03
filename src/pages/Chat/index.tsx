import { ChatContainer, ChatProvider } from '@xkit-yx/im-kit-ui';
import { ConversationContainer } from '@xkit-yx/im-kit-ui';

import './index.less';

const Chat: React.FC = () => {
  return (
    <div className="chat-container">
      <div className="conversation-list">
        <ConversationContainer />
      </div>
      <div className="chat-list">
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </div>
    </div>
  );
};

export default Chat;
