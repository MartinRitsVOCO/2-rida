import { createContext, useContext, Dispatch } from "react";

type ActionDispatch = Dispatch<{
  type: string;
  payload: any;
}>;

interface AppContextType {
  app: any;
  dispatch: ActionDispatch;
}

const AppContext = createContext<AppContextType>({
  app: null,
  dispatch: () => null,
});

export default AppContext;

export const useAppContext = () => useContext(AppContext);