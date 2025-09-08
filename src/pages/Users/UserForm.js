import React from "react";

const UserForm = ({ form, handleChange, handleSubmit, editingId }) => {
  return (
    <form onSubmit={handleSubmit} className="user-form">
      {/* Name field */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />

      {/* Email field */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      {/* Avatar field */}
      <input
        type="text"
        name="avatar"
        placeholder="Avatar URL (optional)"
        value={form.avatar}
        onChange={handleChange}
      />

      <button type="submit">{editingId ? "Update" : "Add"} User</button>
    </form>
  );
};

export default UserForm;
