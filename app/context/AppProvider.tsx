import { useReducer, PropsWithChildren } from "react";
import AppContext from "./AppContext";

interface AppState {
    modalVisible: boolean | string;
}
const initialState: AppState = {
    modalVisible: false,
}

function appReducer(state: any, action: { type: string; payload: any; }) {
    switch (action.type) {
        case "switchModal":
          return { ...state, modalVisible: action.payload };
        default:
          throw new Error("Unknown action type: " + action.type);
  }
}

const AppProvider = ({ children }: PropsWithChildren) => {
  const [app, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ app, dispatch }}>
      {children}
    </AppContext.Provider>
  )
};

export default AppProvider;