'use client'
import Messagebox from "./components/Messagebox"
import Modal from "./components/Modal";
import { useState, useEffect } from "react";

interface ModalData {
    visible: boolean;
    buttonText: string;
    modalChildren: React.ReactNode;
    onClose: () => void;
}

const page = () => {
    const [modalData, setModalData] = useState<ModalData>(
        {
            visible: false,
            buttonText: "Close",
            modalChildren: <div>Modal Content</div>,
            onClose: () => {}
        }
    );
    useEffect(() => {
        setModalData({
            visible: true,
            buttonText: "Alusta",
            modalChildren: <div>Siia läheb mängu juhised!</div>,
            onClose: () => {setModalData({...modalData, visible: false})}
        })
    }, [])

  return (
    <main className="flex flex-col items-center p-12 gap-6 w-full">
        <section className="w-full h-140 border-2 border-gray-200 rounded-lg p-4">
            <p className="text-lg">A</p>
        </section>
        <section className="flex flex-row gap-12 px-12 w-full">
            <div className="flex flex-col justify-around h-full gap-4">
                <button className="bg-green-500 hover:bg-green-600 rounded-2xl py-4 px-8 text-xl font-bold"> Päris </button>
                <button className="bg-red-500 hover:bg-red-600 rounded-2xl py-4 px-8 text-xl font-bold"> Võlts </button>
            </div>
            <Messagebox />
        </section>
        <Modal visible={modalData.visible} onClose={modalData.onClose} buttonText={modalData.buttonText}>
            {modalData.modalChildren}
        </Modal>
    </main>
  )
}
export default page