import React, { useState } from "react";
import FetchUsers from "../../FetchUsers";
import UserForm from "./UserForm";

// ✅ one helper for sort + filter + pagination
export const processUsers = (users, search, sortBy, order, page, perPage) => {
  // sorting
  const sorted = [...users].sort((a, b) => {
    const val =
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : new Date(a.createdAt) - new Date(b.createdAt);

    return order === "asc" ? val : -val;
  });

  // searching
  const filtered = sorted.filter(
    (u) =>
      u?.name?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // pagination
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return { sorted, filtered, totalPages, visible };
};

const Users = () => {
  const { users, loading } = FetchUsers();
  const [form, setForm] = useState({ name: "", email: "", avatar: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);

  if (loading) return <p>Loading...</p>;

  // ✅ reuse helper
  const { visible, totalPages } = processUsers(
    users,
    search,
    sortBy,
    order,
    page,
    10
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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
      window.location.reload(); // quick refresh (can optimize later)
    } catch (err) {
      console.error(err);
    }
    setForm({ name: "", email: "", avatar: "" });
    setEditingId(null);
  };

  const startEdit = (u) => {
    setForm({ name: u.name, email: u.email || "", avatar: u.avatar || "" });
    setEditingId(u.id);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="users-container">
      <h2>Users</h2>

      <UserForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
      />

      {/* Search and sort controls */}
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

      {/* Table */}
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
            <React.Fragment key={u.id}>
              <tr
                style={{ cursor: "pointer" }}
                onClick={() => toggleExpand(u.id)}
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
                <td>{u.email || "-"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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

              {expandedId === u.id && (
                <tr>
                  <td colSpan="5">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px",
                        margin: "5px 0",
                        background: "#f0f8ff",
                        borderRadius: "6px",
                      }}
                    >
                      {u.avatar && (
                        <img
                          src={u.avatar}
                          alt="avatar"
                          width="50"
                          height="50"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                      <div>
                        <p>
                          <strong>Name:</strong> {u.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {u.email || "-"}
                        </p>
                        <p>
                          <strong>Created:</strong>{" "}
                          {new Date(u.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
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
