import React from 'react';

export default function ChatSidebar({ chats, selectedChat, onSelectChat, onLogout }) {
  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-4rem)]">
        <ul className="divide-y divide-gray-100">
          {chats.map((chat) => (
            <li
              key={chat.id}
              className={`p-4 cursor-pointer transition-colors duration-200 ${
                selectedChat?.id === chat.id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {chat.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chat.name || 'Unnamed Chat'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
