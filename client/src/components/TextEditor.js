import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  // Establishes a connection to the server using socket.io
  useEffect(() => {
    const skt = io("http://localhost:3001");
    setSocket(skt);

    // Cleanup function to disconnect the socket when unmounting the component
    return () => {
      skt.disconnect();
    };
  }, []);

  // Loads the document content when the component mounts or the documentId changes
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    // Listens for the "load-document" event from the server
    // and sets the received document content to the Quill editor
    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    // Requests the document content from the server based on the documentId
    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // Saves the document content at a regular interval
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    // Cleanup function to clear the interval when unmounting the component
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // Listens for incoming changes from other users and updates the Quill editor accordingly
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    const handler = (delta) => {
      quill.updateContents(delta);
    };

    // Listens for the "receive-changes" event from the server
    // and applies the received changes to the Quill editor
    socket.on("receive-changes", handler);

    // Cleanup function to remove the event listener when unmounting the component
    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  // Listens for text changes made by the current user and emits the changes to the server
  useEffect(() => {
    if (socket == null || quill == null) {
      return;
    }

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") {
        return;
      }
      socket.emit("send-changes", delta);
    };

    // Listens for the "text-change" event from the Quill editor
    // and emits the changes made by the user to the server
    quill.on("text-change", handler);

    // Cleanup function to remove the event listener when unmounting the component
    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // Callback function to set up the Quill editor when the container ref is available
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) {
      return;
    }
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const ql = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    ql.disable();
    ql.setText("Loading...");
    setQuill(ql);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
}
