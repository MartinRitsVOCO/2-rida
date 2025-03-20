"use client";
import Messagebox from "./components/Messagebox";
import Modal from "./components/Modal";
import { generateMail, MailContent, MailObject } from "../utils/generateMail";
import { useState, useEffect } from "react";

interface ModalData {
  visible: boolean;
  buttonText: string;
  modalChildren: React.ReactNode;
  onClose: () => void;
}

interface Messages {
  [key: string]: string;
}

const rulesMessage = () => {
  return (
    <div>
      Reeglid/Tutvustus: Mängu mängimine on lihtne, saabuvad e-kirjad ning sa
      pead kindlaks tegema kas tegu on võlts või päris e-kirjaga. E-kirja all on
      kaks nuppu, võlts või päris. Vajuta nupule, mis sobib kirjaga. Reegleid ei
      ole palju, ära kasuta chatGPT'd vms. Vaata kiri ning selle muud elemendid
      nt saatja rahulikult läbi ja otsusta
    </div>
  );
};

const messages:Messages= {
  correct: "☺",
  wrong: "WRONG",
  welcome: "Alustamiseks vali, kas E-kiri on õige või vale",
};

function redChance() {
  const randomNumber = Math.floor(Math.random() * 100);

  return randomNumber < 34;
}

const page = () => {
  const [modalData, setModalData] = useState<ModalData>({
    visible: false,
    buttonText: "Close",
    modalChildren: <div>Modal Content</div>,
    onClose: () => {},
  });

  const [email, setEmail] = useState<MailContent>({
    templateID: 0,
    isRed: false,
  });

  const [message, setMessage] = useState<string[]>([]);

  useEffect(() => {
    setModalData({
      visible: true,
      buttonText: "Alusta",
      modalChildren: rulesMessage(),
      onClose: () => {
        setModalData({ ...modalData, visible: false });
        setEmail(generateMail(redChance(), 3, null));
        setMessage([messages.welcome]);
      },
    });
  }, []);

  const handleTrueClick = () => {
    if (email.isRed) {
        console.log("True clicked, incorrect");
        setMessage([messages.wrong, ...message]);
        setEmail(generateMail(redChance(), 3, email.templateID));
    } else {
        console.log("True clicked, correct");
        setMessage([messages.correct, ...message]);
        setEmail(generateMail(redChance(), 3, email.templateID));
    }
  };

  const handleFalseClick = () => {
    if (email.isRed) {
        console.log("False clicked, correct");
        setMessage([messages.correct, ...message]);
        setEmail(generateMail(redChance(), 3, email.templateID));
    } else {
        console.log("False clicked, incorrect");
        setMessage([messages.wrong, ...message]);
        setEmail(generateMail(redChance(), 3, email.templateID));
    }
  };

  return (
    <main className="flex flex-col items-center p-12 gap-6 w-full">
      <section className="w-full h-140 border-2 border-gray-200 rounded-lg p-4">
        {Object.keys(email).map((key, index) => {
          switch (key) {
            case "senders":
              return (
                <p key={index}>{(email.senders as MailObject)?.content}</p>
              );
            case "subject":
              return (
                <p className="text-xl"key={index}>{(email.subject as MailObject)?.content}</p>
              );
            case "greetings":
              return (
                <p key={index}>{(email.greetings as MailObject)?.content}</p>
              );
            case "main_content":
              return (
                <p key={index}>{(email.main_content as MailObject)?.content}</p>
              );
            case "endings":
              return (
                <p key={index}>{(email.endings as MailObject)?.content}</p>
              );
            case "links":
              return <p key={index}>{(email.links as MailObject)?.content}</p>;
            case "attachments":
              return (
                <p key={index}>{(email.attachments as MailObject)?.content}</p>
              );
            default:
              return null;
          }
        })}
      </section>
      <section className="flex flex-row gap-12 px-12 w-full">
        <div className="flex flex-col justify-around h-full gap-4">
          <button
            onClick={handleTrueClick}
            className="bg-green-500 hover:bg-green-600 rounded-2xl py-4 px-8 text-xl font-bold"
          >
            Päris
          </button>
          <button
            onClick={handleFalseClick}
            className="bg-red-500 hover:bg-red-600 rounded-2xl py-4 px-8 text-xl font-bold"
          >
            Võlts
          </button>
        </div>
        <Messagebox messages={message} />
      </section>
      <Modal
        visible={modalData.visible}
        onClose={modalData.onClose}
        buttonText={modalData.buttonText}
      >
        {modalData.modalChildren}
      </Modal>
    </main>
  );
};
export default page;
