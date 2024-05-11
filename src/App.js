import "./App.css";
import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !inputText) {
      alert("Both file and text must be provided!");
      return;
    }

    setLoading(true);
    console.log(process.env.REACT_APP_API_URL);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/getPreSignedUrl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            inputText: inputText,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      const { uploadUrl } = data;

      const result = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "text/plain",
        },
      });

      if (result.ok) {
        const dbUpdateResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/updateDB`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              textInput: inputText,
              InputFilePath: file.name,
            }),
          }
        );

        if (!dbUpdateResponse.ok) {
          throw new Error("Failed to update database");
        }

        const dbUpdateData = await dbUpdateResponse.json();
        console.log(dbUpdateData);
        alert("File uploaded and data saved: " + dbUpdateData.message);
      } else {
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file.", error);
      alert("Error uploading file: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <form
        onSubmit={handleSubmit}
        className="p-5 shadow-lg rounded bg-white max-w-md mx-auto mt-10 border"
      >
        <div className="mb-3">
          <header className="text-xl font-bold py-4 text-center">
            Fovus AWS Coding Challenge
          </header>
          <div className="mb-4 px-4">
            <input
              type="text"
              className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              id="inputText"
              placeholder="Enter text"
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4 px-4">
          <label
            htmlFor="inputFile"
            className="form-label block mb-2 text-sm font-medium text-gray-900"
          >
            File Input
          </label>
          <input
            type="file"
            className="form-control block w-full px-3 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="inputFile"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-blue-700 focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 transition duration-150 ease-in-out"
          disabled={isLoading}
        >
          Submit
        </button>
        <footer className="text-sm py-4">-Vaibhav Rajani</footer>
      </form>
    </div>
  );
}

export default App;
