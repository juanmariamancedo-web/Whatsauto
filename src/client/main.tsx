import "./index.css";
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom'
import client from "./utils/apolloClient";

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import store from "./redux/store";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
