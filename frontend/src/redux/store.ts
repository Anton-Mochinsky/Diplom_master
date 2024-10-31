import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
    systemReducer,
    filesReducer,
} from "./reducers";


const reducers = combineReducers({
  systemReducer,
  filesReducer
});


const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware));
const store = createStore(reducers, composedEnhancer);

//@ts-ignore
window.__store__ = store;

export default store;

export type RootState = ReturnType<typeof reducers>;
