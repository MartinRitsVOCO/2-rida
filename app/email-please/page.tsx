"use client";
import Messagebox from "./components/Messagebox";
import Modal from "./components/Modal";
import { generateMail, MailContent, MailObject } from "../utils/generateMail";
import { useState, useEffect, useRef } from "react";

//Define types
interface ModalData {
  visible: boolean;
  buttonText: string;
  modalChildren: React.ReactNode;
  onClose: () => void;
}

interface GameRecord {
  correct: number;
  wrong: number;
  total: number;
}

interface Messages {
  [key: string]: string;
}

//rules
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

//MessageBox message templates
const messages:Messages= {
  correct: "Fantastiline! Jätka sama suurepärast tööd!",
  wrong: "Mitte päris, aga jätka! Te arenete!",
  welcome: "Tere tulemast! Kas olete valmis oma teadmisi proovile panema?",
};

function redChance() {
  const randomNumber = Math.floor(Math.random() * 100);

  return randomNumber < 34; //% chance of scam emails
}

const page = () => {
    //Modal data
  const [modalData, setModalData] = useState<ModalData>({
    visible: false,
    buttonText: "Close",
    modalChildren: <div>Modal Content</div>,
    onClose: () => {},
  });
  //Email data for the game
  const [email, setEmail] = useState<MailContent>({
    templateID: 0,
    isRed: false,
  });
  //Message data for the messagebox
  const [message, setMessage] = useState<string[]>([]);
  //For keeping track of right and wrong answers and total amount of emails responded to
  const gameRecord = useRef<GameRecord>({
    correct: 0,
    wrong: 0,
    total: 0,
  });

//Initialize the page, generate a modal with the rules that will start the game once clicked away by creating a welcome message and a random email
  useEffect(() => {
    setModalData({
      visible: true,
      buttonText: "Alusta",
      modalChildren: rulesMessage(),
      onClose: () => {
        setModalData({ ...modalData, visible: false });
        setEmail(generateMail(redChance(), 4, null));
        setMessage([messages.welcome]);
      },
    });
  }, []);

//Functions that update the score and display message, based on generated email and user input
  const handleTrueClick = () => {
    if (email.isRed) {
        //True clicked, incorrect
        gameRecord.current.wrong++;
        gameRecord.current.total++;
        setMessage([messages.wrong,`Õigesti tuvastatud: ${gameRecord.current.correct}, Valest arvatud:  ${gameRecord.current.wrong}, Kokku e-kirju:  ${gameRecord.current.total}`, ...message]);
        setEmail(generateMail(redChance(), 4, email.templateID));
    } else {
        //True clicked, correct
        gameRecord.current.correct++;
        gameRecord.current.total++;
        setMessage([messages.correct,`Õigesti tuvastatud: ${gameRecord.current.correct}, Valest arvatud:  ${gameRecord.current.wrong}, Kokku e-kirju:  ${gameRecord.current.total}`, ...message]);
        setEmail(generateMail(redChance(), 4, email.templateID));
    }
  };

  const handleFalseClick = () => {
    if (email.isRed) {
        //False clicked, correct
        gameRecord.current.correct++;
        gameRecord.current.total++;
        setMessage([messages.correct,`Õigesti tuvastatud: ${gameRecord.current.correct}, Valest arvatud:  ${gameRecord.current.wrong}, Kokku e-kirju:  ${gameRecord.current.total}`, ...message]);
        setEmail(generateMail(redChance(), 4, email.templateID));
    } else {
        //False clicked, incorrect
        gameRecord.current.wrong++;
        gameRecord.current.total++;
        setMessage([messages.wrong,`Õigesti tuvastatud: ${gameRecord.current.correct}, Valest arvatud:  ${gameRecord.current.wrong}, Kokku e-kirju:  ${gameRecord.current.total}`, ...message]);
        setEmail(generateMail(redChance(), 4, email.templateID));
    }
  };

//Game UI
  return (
    <main className="flex flex-col items-center p-12 gap-6 w-full">
      <section className="w-full h-140 border-2 border-gray-200 rounded-lg p-4, p-8">
        {Object.keys(email).map((key, index) => {
          switch (key) {
            case "senders":
              return (
                <p className="text-sm p-10" key={index}>{(email.senders as MailObject)?.content}</p>
              );
            case "subject":
              return (
                <p className="text-2xl"key={index}>{(email.subject as MailObject)?.content}</p>
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
                <p className="m-15, p-2" key={index}>{(email.endings as MailObject)?.content}</p>
              );
            case "links":
              return <p className="underline, text-blue-500" key={index}>{(email.links as MailObject)?.content}</p>;
            case "attachments":
              return (
                <p className="text-sm, underline" key={index}>{(email.attachments as MailObject)?.content}</p>
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
            className="bg-green-500 hover:bg-green-800 rounded-2xl py-4 px-8 text-xl font-bold"
          >
            Päris
          </button>
          <button
            onClick={handleFalseClick}
            className="bg-red-500 hover:bg-red-800 rounded-2xl py-4 px-8 text-xl font-bold"
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
