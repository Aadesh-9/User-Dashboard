import React, { useState } from "react";
import FetchUsers from "../FetchUsers";

const Users = () => {
  const { users, loading } = FetchUsers();

  // form + edit state
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [editingId, setEditingId] = useState(null);

  // search + sort + pagination
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name"); // name | date
  const [order, setOrder] = useState("asc"); // asc | desc
  const [page, setPage] = useState(1);

  if (loading) return <p>Loading...</p>;

  // 🔹 sort
  const sorted = [...users].sort((a, b) => {
    let val =
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : new Date(a.createdAt) - new Date(b.createdAt);
    return order === "asc" ? val : -val;
  });

  // 🔹 search
  const filtered = sorted.filter(
    (u) =>
      u?.name?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 pagination
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  // 🔹 handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users/${editingId}`
        : "https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users";
      const method = editingId ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      alert(editingId ? "User updated!" : "User created!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }

    setForm({ name: "", email: "", avatar: "" });
    setEditingId(null);
  };

  // 🔹 start edit
  const startEdit = (u) => {
    setForm({ name: u.name, email: u.email, avatar: u.avatar || "" });
    setEditingId(u.id);
  };

  return (
    <div className="users-container">
      <h2>Users</h2>

      {/* form */}
      <form onSubmit={handleSubmit} className="user-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="avatar"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      {/* search + sort */}
      <div className="users-actions">
        <input
          placeholder="Search name/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* table */}
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((u) => (
            <tr key={u.id}>
              <td>
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt="avatar"
                    width="40"
                    height="40"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  "No Avatar"
                )}
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => startEdit(u)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
