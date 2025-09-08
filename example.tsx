const TrelloLikeApp = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded bg-blue-500"></div>
          <h1 className="text-2xl font-bold text-white">Trello Clone</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-10 rounded-full bg-gray-700 px-4 py-2 text-white">
            Workspaces
          </div>
          <div className="h-10 rounded-full bg-gray-700 px-4 py-2 text-white">
            Recent
          </div>
          <div className="h-10 rounded-full bg-gray-700 px-4 py-2 text-white">
            More
          </div>
          <div className="h-10 w-10 rounded-full bg-blue-500"></div>
        </div>
      </header>

      {/* Board Container */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {/* Columns */}
        {[1, 2, 3, 4].map((col) => (
          <div
            key={col}
            className="w-72 flex-shrink-0 rounded-lg bg-gray-800 p-3"
          >
            {/* Column Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-300">Column {col}</h3>
              <button className="text-gray-400 hover:text-gray-200">•••</button>
            </div>

            {/* Cards */}
            <div className="space-y-3">
              {[1, 2, 3].map((card) => (
                <div
                  key={card}
                  className="rounded-lg bg-gray-700 p-4 shadow-lg transition-all hover:bg-gray-600"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-blue-400">Feature</span>
                    <button className="text-gray-400 hover:text-gray-200">
                      ⋮
                    </button>
                  </div>
                  <h4 className="mb-2 text-white">
                    Card title {card} for column {col}
                  </h4>
                  <p className="text-sm text-gray-400">
                    This is a sample card description with some dummy text
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((avatar) => (
                        <div
                          key={avatar}
                          className="h-6 w-6 rounded-full bg-blue-500"
                        ></div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">2 days left</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Card Button */}
            <button className="mt-4 flex w-full items-center rounded-lg bg-gray-700 px-4 py-2 text-gray-300 transition-all hover:bg-gray-600">
              <span className="mr-2">+</span>
              Add another card
            </button>
          </div>
        ))}

        {/* Add New Column */}
        <div className="w-72 flex-shrink-0">
          <button className="flex w-full items-center justify-center rounded-lg bg-gray-700/50 p-4 text-gray-300 transition-all hover:bg-gray-700">
            <span className="mr-2">+</span>
            Add another list
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrelloLikeApp;
