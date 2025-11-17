import { useState, useRef, useEffect } from "react";

const chatResponses = {
  greeting: [
    "Hi! 👋 I'm SmartShelf AI. I can help you manage your inventory. What would you like to know?",
    "Hello! 🤖 I'm here to assist you with your SmartShelf. How can I help?",
  ],
  storage: [
    "📦 For food storage: Keep items at proper temperatures, use airtight containers, and label them with dates!",
    "💡 Storage tips: Organize by category, use the top shelves for frequently used items, and keep heavier items at the bottom.",
    "🧊 Refrigerated items: Store at 4°C (40°F), keep away from direct sunlight, and check expiry dates regularly.",
  ],
  expiry: [
    "⏰ Check expiry dates on your Dashboard - items expiring soon are highlighted!",
    "🚨 Set up notifications: SmartShelf alerts you 3 days before expiry and on the day of expiry.",
    "📝 Add notes to items: Use the Notes field to remind yourself about proper storage or consumption tips!",
  ],
  consumption: [
    "🥗 Fresh produce: Consume within 3-7 days for best quality.",
    "🥛 Dairy products: Use within 5-10 days of opening.",
    "📦 Packaged goods: Follow the printed expiry date.",
    "🥫 Canned items: Can last 2-5 years from the canned date.",
  ],
  usage: [
    "📱 Add items: Click on 'Add Item' to store new items in your inventory.",
    "🔍 Search & Filter: Use the search bar or filter by category.",
    "📊 Analytics: View charts to understand your consumption patterns.",
    "📋 Activity Log: Track all your inventory changes in real-time.",
  ],
  waste: [
    "♻️ Reduce waste: Plan meals based on expiry dates, use FIFO (First In First Out) method.",
    "🌱 Composting: Organic waste can be composted.",
    "📅 Weekly review: Check your inventory every week to stay on top of expiring items.",
  ],
  general: [
    "That's a great question! You can check out our Dashboard for more insights.",
    "I'm here to help! Ask me about storage tips, expiry management, or how to use SmartShelf.",
    "I'll try my best to help. Feel free to ask anything about inventory management!",
  ],
};

const getResponse = (userMessage) => {
  const message = userMessage.toLowerCase();

  if (
    message.includes("hello") ||
    message.includes("hi") ||
    message.includes("hey")
  ) {
    return chatResponses.greeting[
      Math.floor(Math.random() * chatResponses.greeting.length)
    ];
  }

  if (
    message.includes("store") ||
    message.includes("storage") ||
    message.includes("keep")
  ) {
    return chatResponses.storage[
      Math.floor(Math.random() * chatResponses.storage.length)
    ];
  }

  if (
    message.includes("expir") ||
    message.includes("expire") ||
    message.includes("alert") ||
    message.includes("notif")
  ) {
    return chatResponses.expiry[
      Math.floor(Math.random() * chatResponses.expiry.length)
    ];
  }

  if (
    message.includes("consume") ||
    message.includes("eat") ||
    message.includes("fresh") ||
    message.includes("dairy") ||
    message.includes("how long")
  ) {
    return chatResponses.consumption[
      Math.floor(Math.random() * chatResponses.consumption.length)
    ];
  }

  if (
    message.includes("how") ||
    message.includes("use") ||
    message.includes("add") ||
    message.includes("search") ||
    message.includes("filter") ||
    message.includes("analytics")
  ) {
    return chatResponses.usage[
      Math.floor(Math.random() * chatResponses.usage.length)
    ];
  }

  if (
    message.includes("waste") ||
    message.includes("reduce") ||
    message.includes("compost")
  ) {
    return chatResponses.waste[
      Math.floor(Math.random() * chatResponses.waste.length)
    ];
  }

  return chatResponses.general[
    Math.floor(Math.random() * chatResponses.general.length)
  ];
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! 👋 I'm SmartShelf AI. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getResponse(input),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full p-4 md:p-5 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center"
        title="Open Chat"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-2xl animate-bounce">💬</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-6 md:right-8 w-80 md:w-96 bg-white dark:bg-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-96 md:max-h-[32rem] z-40 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 md:px-6 py-4 md:py-5 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base md:text-lg">SmartShelf AI 🤖</h3>
              <p className="text-xs md:text-sm text-white/80">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50 dark:bg-gray-700/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 md:py-3 rounded-lg text-sm md:text-base ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-4 py-3 rounded-lg rounded-bl-none flex gap-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-600 p-4 md:p-6 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:border-blue-500 transition-all duration-200 resize-none"
                rows="2"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                title="Send message"
              >
                ➤
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              💡 Ask me about storage, expiry, or how to use SmartShelf!
            </p>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-in {
          animation: slideIn 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .slide-in-from-bottom-5 {
          animation: slideIn 0.3s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
}
