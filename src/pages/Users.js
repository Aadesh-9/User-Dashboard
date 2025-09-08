import React, { useState } from "react";
import FetchUsers from "../FetchUsers";

const Users = () => {
  const { users, loading } = FetchUsers();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // sort state
  const [sort, setSort] = useState("name"); // "name" | "date"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  // Form state for Create/Edit
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [editingId, setEditingId] = useState(null);

  if (loading) return <p>Loading...</p>;

  // ----- Sorting -----
  const sortedUsers = [...users].sort((a, b) => {
    let compareVal = 0;
    if (sort === "name") {
      compareVal = a.name.localeCompare(b.name);
    } else {
      compareVal = new Date(a.createdAt) - new Date(b.createdAt);
    }
    return sortOrder === "asc" ? compareVal : -compareVal;
  });

  // ----- Search -----
  const filtered = sortedUsers.filter(
    (u) =>
      u?.name?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // ----- Pagination -----
  const perPage = 10;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create/Edit user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(
          `https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        alert("User updated successfully!");
      } else {
        await fetch(
          "https://6874ce63dd06792b9c954fc7.mockapi.io/api/v1/users",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          }
        );
        alert("User created successfully!");
      }
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
    setForm({ name: "", email: "", avatar: "" });
    setEditingId(null);
  };

  // Edit user
  const startEdit = (user) => {
    setForm({ name: user.name, email: user.email, avatar: user.avatar || "" });
    setEditingId(user.id);
  };

  // View details
  const viewDetails = (user) => {
    alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}`);
  };

  return (
    <div className="users-container">
      <h2>Users</h2>

      {/* Create/Edit Form */}
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
          placeholder="Avatar URL (optional)"
          value={form.avatar}
          onChange={handleChange}
        />
        <button type="submit">
          {editingId ? "Update User" : "Create User"}
        </button>
      </form>

      {/* Search + Sort Options */}
      <div className="users-actions" style={{ margin: "15px 0" }}>
        <input
          placeholder="Search by name/email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Sort by field */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ marginLeft: "15px" }}
        >
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>

        {/* Sort order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Users Table */}
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
          {paginated.map((u) => (
            <tr
              key={u.id}
              onClick={() => viewDetails(u)}
              style={{ cursor: "pointer" }}
            >
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
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEdit(u);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
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
