import React from 'react';
import Routes from "./Routes";
import LoadingWrapper from "../components/LoadingWrapper";

const AppWithLoading = LoadingWrapper(Routes);

export default function App() {

    return (
      AppWithLoading({
      })
    );
}
