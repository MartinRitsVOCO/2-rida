interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  buttonText: string;
}

const Modal = ({ visible, onClose, children, buttonText }: ModalProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700/70">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-[700]">
        <div className="p-6 bg-gray-200 rounded-lg text-black">
          {children}
        </div>
        <div className="flex flex-row justify-center mt-12">
          <button className="bg-blue-600 py-4 px-8 rounded-lg text-xl font-bold hover:bg-blue-700" onClick={onClose}>{buttonText}</button>
        </div>
      </div>
    </div>
  )
}
export default Modal