import React, { useState, useEffect } from "react";
import "./App.css";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";

function App() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchPosts();
  }, []);

  if (!ready) {
    return null;
  }

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("File uploaded and NFT minted successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage("Failed to upload file and mint NFT.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {ready && authenticated ? (
          <div>
            <textarea
              readOnly
              value={JSON.stringify(user, null, 2)}
              style={{ width: "90%", height: "150px", borderRadius: "6px" }}
            />
            <button
              onClick={logout}
              style={{
                marginTop: "20px",
                padding: "12px",
                backgroundColor: "#069478",
                color: "#FFF",
                border: "none",
                borderRadius: "6px",
              }}
            >
              Log Out
            </button>
            {message && <p>{message}</p>}
          </div>
        ) : (
          <button
            onClick={login}
            style={{
              padding: "12px",
              backgroundColor: "#069478",
              color: "#FFF",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Log In
          </button>
        )}
      </header>
      <main className="App-main">
        <h2>Event Posts</h2>
        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={index} className="post">
              <img src={post.imageUrl} alt="Event Post" className="post-image" />
              <p>{post.info}</p>
              <small>{new Date(post.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </main>
      {ready && authenticated && (
        <footer className="App-footer">
          <input type="file" onChange={handleFileChange} />
          <button
            onClick={handleUpload}
            style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "#069478",
              color: "#FFF",
              border: "none",
              borderRadius: "6px",
            }}
          >
            Upload and Mint NFT
          </button>
        </footer>
      )}
    </div>
  );
}

export default App;