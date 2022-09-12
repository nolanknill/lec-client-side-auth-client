import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState( !!localStorage.authToken );
  const [ posts, setPosts ] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // POST /login with username and password values
    const usernameValue = e.target.username.value;
    const passwordValue = e.target.password.value;

    const response = await axios.post("http://localhost:8080/login", {
      username: usernameValue,
      password: passwordValue
    });

    localStorage.authToken = response.data.token;
    localStorage.username = usernameValue;
    setIsLoggedIn(true);
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    
    setIsLoggedIn(false);
  }

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    axios.get("http://localhost:8080/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.authToken}`
      }
    })
    .then(response => {
      setPosts(response.data);
    })
    .catch( err => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");
    
      setIsLoggedIn(false);
    })
  }, [isLoggedIn])
  


  if (!isLoggedIn) {
    return (
      <>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label>Username:<input type="text" name="username" /></label>
          <label>Password:<input type="password" name="password" /></label>
          <input type="submit" value="Login" />
        </form>
      </>
    );
  }

  return (
    <>
      <h1>Here are your posts, {localStorage.username}</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
      <button onClick={handleLogout}>Logout</button>
    </>

  )
  
}

export default App;
