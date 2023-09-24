import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom"; // Импортируем Link
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FixedSizeList } from "react-window";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const location = useLocation();

  useEffect(() => {
    let url = "https://jsonplaceholder.typicode.com/posts";

    if (selectedUser) {
      url += `?userId=${selectedUser}`;
    }

    axios
      .get(url)
      .then((response) => {
        const posts = response.data;
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [selectedUser]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const users = response.data;
        setUsers(users);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const postId = path.substring(path.lastIndexOf("/") + 1);

    if (postId && posts.length > 0) {
      const post = posts.find((post) => post.id === parseInt(postId));
      if (post) {
        const userId = post.userId;
        const user = users.find((user) => user.id === userId);
        if (user) {
          toast.info(`Открыт пост автора: ${user.name}`);
        }
      }
    }
  }, [location.pathname, posts, users]);

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  return (
    <div className="container">
      <h1 className="mt-4">Список постов</h1>
      <div className="mb-3">
        <label htmlFor="userSelect" className="form-label">
          Фильтровать по пользователю:
        </label>
        <select
          id="userSelect"
          className="form-select"
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">Все пользователи</option>
          {users.map((user) => (
            <option value={user.id} key={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      {posts.length > 0 ? (
        <FixedSizeList
          className="overflow"
          height={850}
          itemCount={posts.length}
          itemSize={150}
          width={1290}
        >
          {({ index, style }) => (
            <div className="overflow" style={style}>
              <div className="card my-4" key={posts[index].id}>
                <div className="card-body">
                  <h2 className="card-title">
                    {posts[index].title}
                  </h2>
                  <p className="card-text">
                    {posts[index].body.length > 100
                      ? `${posts[index].body.substring(0, 100)}...`
                      : posts[index].body}
                  </p>
                  <Link to={`/post/${posts[index].id}`}>
                    <button>Просмотр</button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </FixedSizeList>
      ) : (
        <p>Нет постов для отображения</p>
      )}
    </div>
  );
};

export default PostList;
