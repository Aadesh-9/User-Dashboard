const UserTable = ({
  users,
  search,
  setSearch,
  sortBy,
  setSortBy,
  order,
  setOrder,
  page,
  setPage,
  perPage,
  startEdit,
  onRowClick,
}) => {
  //  sort
  const sorted = [...users].sort((a, b) => {
    let val =
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : new Date(a.createdAt) - new Date(b.createdAt);
    return order === "asc" ? val : -val;
  });

  //  search
  const filtered = sorted.filter(
    (u) =>
      u?.name?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase())
  );

  //  pages
  const totalPages = Math.ceil(filtered.length / perPage);
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <>
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
            <tr
              key={u.id}
              style={{ cursor: "pointer" }}
              onClick={() => onRowClick(u)}
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
          ))}
        </tbody>
      </table>

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
    </>
  );
};

export default UserTable;
