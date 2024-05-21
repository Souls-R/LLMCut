'use client'

import NoSSRWrapper from "./NoSSRWrapper";
import Home from "./Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
  return <NoSSRWrapper><Home /><ToastContainer autoClose={10000} /></NoSSRWrapper>
}
