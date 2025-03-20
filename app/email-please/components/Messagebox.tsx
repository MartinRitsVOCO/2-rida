//Message box for welcome message ; correct/wrong answer message ; for keeping score
const Messagebox = ({ messages }: { messages?: string[] }) => {
  return (
    <div className="w-full h-50 border-2 border-gray-200 rounded-lg p-4 overflow-y-auto max-h-60">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index} className="">
            {message}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No Messages yet</p>
      )}
    </div>
  )
}
export default Messagebox