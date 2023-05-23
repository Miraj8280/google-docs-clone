import TextEditor from "./components/TextEditor";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { v4 as uuidV4 } from "uuid";
import ToolBar from "./components/ToolBar";

function App() {
  return (
    <Router>
      {/* Render the Toolbar component */}
      <ToolBar />

      {/* Define the routes */}
      <Routes>
        {/* Route for the home page */}
        {/* Navigate to a dynamically generated document route */}
        <Route path="/" exact element={<Navigate to={`/documents/${uuidV4()}`} />} />

        {/* Route for the TextEditor component */}
        {/* Render the TextEditor component with the document ID from the URL */}
        <Route path="/documents/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
